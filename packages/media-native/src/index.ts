// media-native: React Native wrapper around media-core.
// Same contract/shape as media-react's hooks (useMediaSearch, useMediaCurated,
// useMediaItem, useMediaEvents) — same names, same return shape — but its
// own package, since RN's runtime specifics may eventually diverge from web.
//
// RULE: may import from "media-core" only. Never import media-ui-native,
// media-react, or the app.
//
// If time is short, this can stay a thin near-duplicate of media-react —
// note that explicitly in the README rather than leaving it silently unequal.

export {};
