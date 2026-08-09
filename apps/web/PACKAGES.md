# Package Documentation

SDK + component docs for all custom packages in this monorepo. Each section
below is that package's own README.

## Contents
- [media-core](#media-core) — framework-agnostic SDK (Pexels client, events, cache)
- [media-react](#media-react) — React hooks/provider wrapping media-core
- [media-ui-react](#media-ui-react) — headless UI components (Grid, Lightbox, ReelSwiper)
- [media-native](#media-native) — React Native wrapper (stub)
- [media-ui-native](#media-ui-native) — React Native UI components (stub)

---

# media-core

Framework-agnostic SDK for Pexels photos + videos. Pure TypeScript — no
React, no DOM, no React Native. Could theoretically power a CLI or a
different UI framework with zero changes.

## Install

Within this monorepo, other packages depend on it via npm workspaces:
```json
{ "dependencies": { "media-core": "*" } }
```

## Setup

```ts
import { MediaClient } from "media-core";

const client = new MediaClient({
  apiKey: process.env.PEXELS_API_KEY!,
  // baseUrl / videoBaseUrl overrides available for testing
});
```

## API

### Photos
| Method | Description |
|---|---|
| `client.search({ query, page?, perPage? })` | Search photos by keyword. Returns `MediaPage`. |
| `client.curated(page?, perPage?)` | Curated/trending photo feed. |
| `client.getById(id)` | Fetch a single photo by id. Returns `MediaItem`. |

### Videos
| Method | Description |
|---|---|
| `client.searchVideos({ query, page?, perPage? })` | Search videos by keyword. |
| `client.curatedVideos(page?, perPage?)` | Popular video feed. |
| `client.getVideoById(id)` | Fetch a single video by id. |

Video normalization prefers the `hd` file if present, falling back to `sd`,
then whatever's first in `video_files`.

### Events
```ts
client.events.on("view", (payload) => { /* ... */ });
const unsubscribe = client.events.on("download", (payload) => { /* ... */ });

client.trackView(itemId);      // emits "view"
client.trackDownload(itemId);  // emits "download"

unsubscribe();
```
`attachDefaultLogger(client.events)` wires up a console logger for both
event types — useful for debugging, and doesn't stop you from also
subscribing independently for your own tracking.

### Caching
Every `search`/`curated`/video-equivalent call is deduped and cached for 60s
per unique `(query, page, perPage)` key via an internal `SimpleCache`, so
rapid repeat calls (e.g. React StrictMode double-invocation) don't double-hit
the network.

## Types

```ts
interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt?: string;
  photographer?: string;
  durationSeconds?: number; // videos only
}

interface MediaPage {
  items: MediaItem[];
  page: number;
  perPage: number;
  totalResults: number;
  hasNextPage: boolean;
}
```

`MediaClientError` is thrown on network failure or a non-OK HTTP response,
carrying an optional `status` and `cause`.

## Testing it standalone

```bash
npm install
npm install -D tsx
PEXELS_API_KEY=your_key npx tsx smoke-test.ts
```

## Rules

This package imports nothing from any other package in the repo. Keep it
that way — it's what makes it portable.
-e 
---

# media-react

Thin React wrapper around [`media-core`](../media-core). Provider + hooks —
no business logic lives here, only platform adaptation.

## Install

```json
{ "dependencies": { "media-core": "*" }, "peerDependencies": { "react": ">=18" } }
```

## Setup

Wrap your app once, near the root:

```tsx
import { MediaProvider } from "media-react";

<MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
  <App />
</MediaProvider>
```

Never hardcode the API key — it should always come from an env var.

## Hooks

All fetching hooks share one return shape, `AsyncState<T>`:
```ts
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
```

| Hook | Returns | Notes |
|---|---|---|
| `useMediaSearch(query)` | `AsyncState<MediaItem[]> & { hasNextPage, loadMore }` | Photo search. Re-fetches page 1 when `query` changes. |
| `useVideoSearch(query)` | same shape as above | Video search, same pagination pattern. |
| `useMediaCurated()` | same shape (no `query`) | Curated/trending photo feed. |
| `useMediaItem(id)` | `AsyncState<MediaItem>` | Single item lookup; pass `null` to skip fetching. |
| `useMediaEvents()` | `{ trackView, trackDownload }` | Fire SDK events without touching `media-core` directly. |
| `useMediaClient()` | `MediaClient` | Escape hatch for the rare case you need the raw client. Prefer the hooks above. |

### Example

```tsx
const { data: items, loading, error, hasNextPage, loadMore } = useMediaSearch(query);
const { trackView, trackDownload } = useMediaEvents();

items?.map((item) => (
  <img key={item.id} src={item.thumbnailUrl} onClick={() => trackView(item.id)} />
));
```

## Rules

- May import from `media-core` only. Never `media-ui-react`, `media-native`,
  or the app.
- No business logic here — if you need new fetching behavior, add it to
  `media-core` first, then expose it via a hook.
-e 
---

# media-ui-react

Headless, pure-UI component library: Grid, Lightbox, ReelSwiper. Ships zero
styles and knows nothing about Pexels or `media-core` — every component
takes data and callbacks purely as props. Each ships as a hook (state +
prop-getters) plus a thin render-prop convenience component.

## Install

```json
{ "peerDependencies": { "react": ">=18" } }
```
No dependency on `media-core` — not even listed. That's intentional; this
package must stay reusable outside this project's SDK.

## Grid

Infinite-scroll grid via `IntersectionObserver` (no scroll-event listeners).

```tsx
<Grid
  items={items}                 // T[] where T has an `id`
  hasMore={hasNextPage}
  onLoadMore={loadMore}
  containerClassName="columns-2 sm:columns-3 lg:columns-4 gap-3"
  itemClassName="mb-3 break-inside-avoid"
  renderItem={(item, index) => <img src={item.thumbnailUrl} onClick={() => open(index)} />}
/>
```
`containerClassName`/`itemClassName`/`sentinelClassName` are all optional —
use CSS columns (as above) for a Pinterest-style masonry layout, or a plain
`grid grid-cols-*` for a uniform grid. For full control, use `useGrid`
directly and spread `getGridProps()` / `getItemProps()` / `getSentinelProps()`
onto your own markup.

## Lightbox

Overlay with keyboard nav (Escape closes, arrow keys navigate) and a basic
focus trap. Fully headless — style it via className props:

```tsx
<Lightbox
  items={items}
  activeIndex={activeIndex}     // number | null; null = closed
  onClose={() => setActiveIndex(null)}
  onNavigate={(next) => setActiveIndex(next)}
  overlayClassName="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 backdrop-blur-sm"
  contentClassName="flex max-w-[90vw] items-center justify-center"
  closeButtonClassName="fixed right-5 top-5 ..."
  prevButtonClassName="fixed left-5 top-1/2 ..."
  nextButtonClassName="fixed right-5 top-1/2 ..."
  renderContent={(item) => <img src={item.url} />}
/>
```
Click-outside-to-close is built in (fires `onClose` only when the click
target is the overlay itself, not its children). Include `overflow-y-auto`
in `overlayClassName` if content can exceed viewport height.

## ReelSwiper

Vertical snap-paging feed with active-item detection via
`IntersectionObserver`, plus an infinite-scroll trigger as you approach the
end of the loaded items (same idea as Grid's sentinel, adapted for one-at-
a-time paging).

```tsx
<ReelSwiper
  items={videoItems}
  activeIndex={reelIndex}
  onActiveChange={setReelIndex}
  hasMore={hasNextPage}
  onLoadMore={loadMore}
  renderItem={(item, isActive) => <video src={item.url} />}
/>
```
Requires the container to have CSS scroll-snap set by you
(`scrollSnapType: "y mandatory"` on the container, `scrollSnapAlign: "start"`
on each item) — the hook detects the active item but doesn't apply snap CSS
itself.

## Rules

- Imports nothing from `media-core`, `media-react`, or `media-native`.
- Components are generic over `T extends { id: string | number }` — never
  hardcode a Pexels-shaped field (like `thumbnailUrl`) inside this package;
  those only appear in the consuming app's `renderItem`/`renderContent`.
- All styling is opt-in via className props. No default CSS ships.
-e 
---

# media-native

**Status: stub — not yet built.** Cut for time (see root README's "Cuts"
section). This is where a React Native wrapper around `media-core` would
live, mirroring `media-react`'s contract exactly.

## Intended API (mirror of media-react)

Same hook names, same shapes, same rules — just backed by React Native
primitives internally where relevant:

- `MediaProvider` — same props (`apiKey`, `baseUrl?`)
- `useMediaSearch(query)`
- `useVideoSearch(query)`
- `useMediaCurated()`
- `useMediaItem(id)`
- `useMediaEvents()`

## Rules (once built)

- May import from `media-core` only.
- Never import `media-ui-native`, `media-react`, or the app.
- Keep hook names/return shapes identical to `media-react` — consumers
  (and the two SKILL.md docs) should be able to treat "web" and "native"
  as the same mental model.

## To start building this

```bash
cd packages/media-native
npm install --save-peer react react-native
```
Then implement each hook above by porting the corresponding one from
`media-react/src/hooks.ts` — the internals should look nearly identical
since RN uses the same React hooks API.
-e 
---

# media-ui-native

**Status: stub — not yet built.** Cut for time (see root README's "Cuts"
section). This is where React Native versions of Grid/Lightbox/ReelSwiper
would live, rebuilt with native primitives (`FlatList`, `Modal`, `Animated`,
etc.) instead of DOM/CSS.

## Intended API (contract mirror of media-ui-react)

- `Grid` — `FlatList`-backed infinite scroll (RN's `onEndReached` in place
  of `IntersectionObserver`)
- `Lightbox` — `Modal`-backed overlay with the same `activeIndex` /
  `onClose` / `onNavigate` prop shape
- `ReelSwiper` — snap-paging via `FlatList`'s `pagingEnabled` +
  `onViewableItemsChanged` in place of `IntersectionObserver`

Same generic-over-`{ id }` design as `media-ui-react` — no dependency on
`media-core` here either.

## Rules (once built)

- Imports nothing from `media-core`, `media-react`, or `media-native`.
- Components take data/callbacks as props only — no SDK knowledge.

## To start building this

```bash
cd packages/media-ui-native
npm install --save-peer react react-native
```
