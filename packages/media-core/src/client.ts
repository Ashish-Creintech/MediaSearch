import { SimpleCache } from "./cache";
import { MediaEventEmitter } from "./events";
import {
  MediaClientConfig,
  MediaClientError,
  MediaItem,
  MediaPage,
  SearchParams,
} from "./types";

const DEFAULT_BASE_URL = "https://api.pexels.com/v1";
const DEFAULT_VIDEO_BASE_URL = "https://api.pexels.com/videos";

export class MediaClient {
  private apiKey: string;
  private baseUrl: string;
  private cache: SimpleCache<MediaPage>;

  // Exposed so wrappers (media-react/media-native) and the app can subscribe
  // to activity without media-core knowing who's listening.
  public readonly events = new MediaEventEmitter();

  constructor(config: MediaClientConfig) {
    if (!config.apiKey) {
      throw new MediaClientError("MediaClient requires an apiKey");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.cache = new SimpleCache<MediaPage>(60_000);
  }

  private async request<T>(url: string): Promise<T> {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { Authorization: this.apiKey },
      });
    } catch (err) {
      throw new MediaClientError("Network request failed", undefined, err);
    }

    if (!res.ok) {
      throw new MediaClientError(`Pexels request failed: ${res.statusText}`, res.status);
    }

    return res.json() as Promise<T>;
  }

  async search({ query, page = 1, perPage = 20 }: SearchParams): Promise<MediaPage> {
    const cacheKey = `search:${query}:${page}:${perPage}`;
    return this.cache.dedupe(cacheKey, async () => {
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
      const raw = await this.request<PexelsSearchResponse>(url);
      return normalizeSearchResponse(raw, page, perPage);
    });
  }

  async curated(page = 1, perPage = 20): Promise<MediaPage> {
    const cacheKey = `curated:${page}:${perPage}`;
    return this.cache.dedupe(cacheKey, async () => {
      const url = `${this.baseUrl}/curated?page=${page}&per_page=${perPage}`;
      const raw = await this.request<PexelsSearchResponse>(url);
      return normalizeSearchResponse(raw, page, perPage);
    });
  }

  async getById(id: string): Promise<MediaItem> {
    const url = `${this.baseUrl}/photos/${id}`;
    const raw = await this.request<PexelsPhoto>(url);
    return normalizePhoto(raw);
  }

  // Call when the app records a user viewing an item.
  trackView(itemId: string): void {
    this.events.emit("view", { itemId, type: "view" });
  }

  // Call when the app records a user downloading/saving an item.
  trackDownload(itemId: string): void {
    this.events.emit("download", { itemId, type: "download" });
  }
}

// ---- Pexels raw response shapes (minimal, only what we use) ----

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  photographer: string;
  alt: string;
  src: { original: string; medium: string };
}

interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  photos: PexelsPhoto[];
}

// ---- Normalization: Pexels shape -> our own MediaItem/MediaPage shape ----
// Keeping this isolated means swapping providers (e.g. Unsplash) later only
// touches this function, not anything downstream.

function normalizePhoto(p: PexelsPhoto): MediaItem {
  return {
    id: String(p.id),
    type: "photo",
    url: p.src.original,
    thumbnailUrl: p.src.medium,
    width: p.width,
    height: p.height,
    alt: p.alt,
    photographer: p.photographer,
  };
}

function normalizeSearchResponse(raw: PexelsSearchResponse, page: number, perPage: number): MediaPage {
  return {
    items: raw.photos.map(normalizePhoto),
    page,
    perPage,
    totalResults: raw.total_results,
    hasNextPage: Boolean(raw.next_page),
  };
}
