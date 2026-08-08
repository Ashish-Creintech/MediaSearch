# Skill: Wiring Media Data (media-react)

Use this when building or editing UI in `apps/web` that needs to fetch or
track media data. Always go through `media-react` — never import `media-core`
directly inside a component.

## Setup
Wrap the app once, near the root, with the API key from an env var:

```tsx
import { MediaProvider } from "media-react";

<MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
  <App />
</MediaProvider>
```

Never hardcode the key. It must come from `VITE_PEXELS_API_KEY` (see `.env.example`).

## Which hook to use
- `useMediaSearch(query: string)` — search by keyword. Returns
  `{ data, loading, error, hasNextPage, loadMore }`. Re-fetches automatically
  when `query` changes.
- `useMediaCurated()` — trending/curated feed, same return shape (minus `query`).
- `useMediaItem(id: string | null)` — single item lookup. Returns
  `{ data, loading, error }`.
- `useMediaEvents()` — returns `{ trackView, trackDownload }`. Call
  `trackView(item.id)` when an item is opened/viewed, `trackDownload(item.id)`
  when a user downloads/saves it.

All fetching hooks share the same `{ data, loading, error }` shape
(`AsyncState<T>`) — don't invent a different one when adding a new hook.

## Rules
- Never call `MediaClient` from `media-core` directly in a component or in
  the app — always go through a `media-react` hook.
- Don't duplicate fetch/cache logic in the app — if a hook is missing what
  you need, add it to `media-react`, not inline in a component.
- `loadMore()` is safe to call repeatedly; it no-ops while already loading or
  when `hasNextPage` is false.

## Example
```tsx
const { data: items, loading, hasNextPage, loadMore } = useMediaSearch(query);
const { trackView } = useMediaEvents();
```
