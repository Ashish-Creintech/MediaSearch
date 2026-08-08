// Public API surface of media-core. Wrappers (media-react/media-native)
// should only ever import from here — never reach into internal files.

export { MediaClient } from "./client";
export { MediaEventEmitter, attachDefaultLogger } from "./events";
export { SimpleCache } from "./cache";
export type {
  MediaItem,
  MediaPage,
  MediaType,
  MediaClientConfig,
  SearchParams,
} from "./types";
export { MediaClientError } from "./types";
