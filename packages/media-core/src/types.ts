// Types describing normalized media results — kept independent of Pexels'
// exact response shape so a future provider swap doesn't leak upward.

export type MediaType = "photo" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt?: string;
  photographer?: string;
  durationSeconds?: number; // videos only
}

export interface MediaPage {
  items: MediaItem[];
  page: number;
  perPage: number;
  totalResults: number;
  hasNextPage: boolean;
}

export interface MediaClientConfig {
  apiKey: string;
  baseUrl?: string; // override for testing
}

export interface SearchParams {
  query: string;
  page?: number;
  perPage?: number;
}

export class MediaClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = "MediaClientError";
  }
}
