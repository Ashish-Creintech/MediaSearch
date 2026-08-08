// Basic in-memory cache with TTL + in-flight request de-dupe. Good enough for
// a take-home; swap for something smarter (LRU, persisted) later if needed.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class SimpleCache<T = unknown> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private inFlight: Map<string, Promise<T>> = new Map();

  constructor(private ttlMs: number = 60_000) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  // Wraps a fetcher so concurrent calls for the same key share one request,
  // and repeat calls within the TTL skip the network entirely.
  async dedupe(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    const pending = this.inFlight.get(key);
    if (pending) return pending;

    const promise = fetcher()
      .then((value) => {
        this.set(key, value);
        this.inFlight.delete(key);
        return value;
      })
      .catch((err) => {
        this.inFlight.delete(key);
        throw err;
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  clear(): void {
    this.store.clear();
  }
}
