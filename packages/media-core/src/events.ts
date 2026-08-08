// Minimal, dependency-free event emitter. This is what lets the SDK announce
// activity (download/view) without knowing or caring who's listening —
// could be a console logger, analytics, or the app itself.

export type MediaEventName = "download" | "view" | string;

export interface MediaEventPayload {
  itemId: string;
  type: string;
  timestamp: number;
  [key: string]: unknown;
}

type Listener = (payload: MediaEventPayload) => void;

export class MediaEventEmitter {
  private listeners: Map<MediaEventName, Set<Listener>> = new Map();

  on(event: MediaEventName, listener: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // returns an unsubscribe function — nicer ergonomics than a separate off() call
    return () => this.off(event, listener);
  }

  off(event: MediaEventName, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: MediaEventName, payload: { itemId: string; type: string; [key: string]: unknown }): void {
    const full: MediaEventPayload = {
      ...payload,
      timestamp: Date.now(),
    };
    this.listeners.get(event)?.forEach((listener) => listener(full));
  }
}

// Default listener: logs every event to console. The app can still subscribe
// independently for its own tracking — this doesn't replace that, it's a
// baseline so events are visible even if nothing else is listening.
export function attachDefaultLogger(emitter: MediaEventEmitter): () => void {
  const log = (payload: MediaEventPayload) =>
    console.log(`[media-core] event:${payload.type}`, payload);

  const unsubDownload = emitter.on("download", log);
  const unsubView = emitter.on("view", log);

  return () => {
    unsubDownload();
    unsubView();
  };
}
