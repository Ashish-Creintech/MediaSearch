// import { SimpleCache } from "./cache";
// import { MediaEventEmitter } from "./events";
// import {
//   MediaClientConfig,
//   MediaClientError,
//   MediaItem,
//   MediaPage,
//   SearchParams,
// } from "./types";

// const DEFAULT_BASE_URL = "https://api.pexels.com/v1";
// const DEFAULT_VIDEO_BASE_URL = "https://api.pexels.com/videos";

// export class MediaClient {
//   private apiKey: string;
//   private baseUrl: string;
//   private cache: SimpleCache<MediaPage>;

//   // Exposed so wrappers (media-react/media-native) and the app can subscribe
//   // to activity without media-core knowing who's listening.
//   public readonly events = new MediaEventEmitter();

//   constructor(config: MediaClientConfig) {
//     if (!config.apiKey) {
//       throw new MediaClientError("MediaClient requires an apiKey");
//     }
//     this.apiKey = config.apiKey;
//     this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
//     this.cache = new SimpleCache<MediaPage>(60_000);
//   }

//   private async request<T>(url: string): Promise<T> {
//     let res: Response;
//     try {
//       res = await fetch(url, {
//         headers: { Authorization: this.apiKey },
//       });
//     } catch (err) {
//       throw new MediaClientError("Network request failed", undefined, err);
//     }

//     if (!res.ok) {
//       throw new MediaClientError(`Pexels request failed: ${res.statusText}`, res.status);
//     }

//     return res.json() as Promise<T>;
//   }

//   async search({ query, page = 1, perPage = 20 }: SearchParams): Promise<MediaPage> {
//     const cacheKey = `search:${query}:${page}:${perPage}`;
//     return this.cache.dedupe(cacheKey, async () => {
//       const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
//       const raw = await this.request<PexelsSearchResponse>(url);
//       return normalizeSearchResponse(raw, page, perPage);
//     });
//   }

//   async curated(page = 1, perPage = 20): Promise<MediaPage> {
//     const cacheKey = `curated:${page}:${perPage}`;
//     return this.cache.dedupe(cacheKey, async () => {
//       const url = `${this.baseUrl}/curated?page=${page}&per_page=${perPage}`;
//       const raw = await this.request<PexelsSearchResponse>(url);
//       return normalizeSearchResponse(raw, page, perPage);
//     });
//   }

//   async getById(id: string): Promise<MediaItem> {
//     const url = `${this.baseUrl}/photos/${id}`;
//     const raw = await this.request<PexelsPhoto>(url);
//     return normalizePhoto(raw);
//   }

//   // Call when the app records a user viewing an item.
//   trackView(itemId: string): void {
//     this.events.emit("view", { itemId, type: "view" });
//   }

//   // Call when the app records a user downloading/saving an item.
//   trackDownload(itemId: string): void {
//     this.events.emit("download", { itemId, type: "download" });
//   }
// }

// // ---- Pexels raw response shapes (minimal, only what we use) ----

// interface PexelsPhoto {
//   id: number;
//   width: number;
//   height: number;
//   photographer: string;
//   alt: string;
//   src: { original: string; medium: string };
// }

// interface PexelsSearchResponse {
//   page: number;
//   per_page: number;
//   total_results: number;
//   next_page?: string;
//   photos: PexelsPhoto[];
// }

// // ---- Normalization: Pexels shape -> our own MediaItem/MediaPage shape ----
// // Keeping this isolated means swapping providers (e.g. Unsplash) later only
// // touches this function, not anything downstream.

// function normalizePhoto(p: PexelsPhoto): MediaItem {
//   return {
//     id: String(p.id),
//     type: "photo",
//     url: p.src.original,
//     thumbnailUrl: p.src.medium,
//     width: p.width,
//     height: p.height,
//     alt: p.alt,
//     photographer: p.photographer,
//   };
// }

// function normalizeSearchResponse(raw: PexelsSearchResponse, page: number, perPage: number): MediaPage {
//   return {
//     items: raw.photos.map(normalizePhoto),
//     page,
//     perPage,
//     totalResults: raw.total_results,
//     hasNextPage: Boolean(raw.next_page),
//   };
// }


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
  private videoBaseUrl: string;
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
    this.videoBaseUrl = config.videoBaseUrl ?? DEFAULT_VIDEO_BASE_URL;
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

  async search({ query, page = 1, perPage = 5 }: SearchParams): Promise<MediaPage> {
    const cacheKey = `search:${query}:${page}:${perPage}`;
    return this.cache.dedupe(cacheKey, async () => {
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
      const raw = await this.request<PexelsSearchResponse>(url);
      return normalizeSearchResponse(raw, page, perPage);
    });
  }

  async curated(page = 1, perPage = 5): Promise<MediaPage> {
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

  // ---- Video endpoints (separate Pexels API surface from photos) ----

  async searchVideos({ query, page = 1, perPage = 5 }: SearchParams): Promise<MediaPage> {
    const cacheKey = `videoSearch:${query}:${page}:${perPage}`;
    return this.cache.dedupe(cacheKey, async () => {
      const url = `${this.videoBaseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
      const raw = await this.request<PexelsVideoSearchResponse>(url);
      return normalizeVideoSearchResponse(raw, page, perPage);
    });
  }

  async curatedVideos(page = 1, perPage = 20): Promise<MediaPage> {
    const cacheKey = `curatedVideos:${page}:${perPage}`;
    return this.cache.dedupe(cacheKey, async () => {
      const url = `${this.videoBaseUrl}/popular?page=${page}&per_page=${perPage}`;
      const raw = await this.request<PexelsVideoSearchResponse>(url);
      return normalizeVideoSearchResponse(raw, page, perPage);
    });
  }

  async getVideoById(id: string): Promise<MediaItem> {
    const url = `${this.videoBaseUrl}/videos/${id}`;
    const raw = await this.request<PexelsVideo>(url);
    return normalizeVideo(raw);
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

interface PexelsVideoFile {
  quality: string; // "hd" | "sd" | "hls" etc.
  width: number;
  height: number;
  link: string;
}

interface PexelsVideoPicture {
  picture: string; // thumbnail image
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number; // seconds
  user: { name: string };
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
}

interface PexelsVideoSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  videos: PexelsVideo[];
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

function normalizeVideo(v: PexelsVideo): MediaItem {
  // Prefer an "hd" file if present, else fall back to the first available.
  const preferred =
    v.video_files.find((f) => f.quality === "hd") ?? v.video_files.find((f) => f.quality === "sd") ?? v.video_files[0];

  return {
    id: String(v.id),
    type: "video",
    url: preferred?.link ?? "",
    thumbnailUrl: v.video_pictures[0]?.picture ?? "",
    width: v.width,
    height: v.height,
    photographer: v.user?.name,
    durationSeconds: v.duration,
  };
}

function normalizeVideoSearchResponse(
  raw: PexelsVideoSearchResponse,
  page: number,
  perPage: number
): MediaPage {
  return {
    items: raw.videos.map(normalizeVideo),
    page,
    perPage,
    totalResults: raw.total_results,
    hasNextPage: Boolean(raw.next_page),
  };
}