# Package & Component Documentation

Everything you need to consume this monorepo's custom packages, in one file.

## Contents
- [media-core](#media-core) — framework-agnostic SDK (Pexels client, events, cache)
- [media-react](#media-react) — React hooks/provider wrapping media-core
- [media-ui-react](#media-ui-react) — headless UI: Grid, GridSkeleton, Loader, Lightbox, ReelSwiper
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

Headless, pure-UI component library: `Grid`, `GridSkeleton`, `Loader`,
`Lightbox`, `ReelSwiper`. Ships zero styles and knows nothing about Pexels or
`media-core` — every component takes data and callbacks purely as props.
Each interactive component ships as a hook (state + prop-getters) plus a
thin render-prop convenience component.

## Install

```json
{ "peerDependencies": { "react": ">=18" } }
```
No dependency on `media-core` — not even listed. That's intentional; this
package must stay reusable outside this project's SDK.

---

## Grid

Infinite-scroll grid. Detects "near the bottom" via `IntersectionObserver`
on an invisible sentinel element — no scroll-event listeners, no layout
thrashing.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `T[]` (T extends `{ id }`) | yes | Data to render. |
| `hasMore` | `boolean` | yes | Whether more pages exist. |
| `onLoadMore` | `() => void` | yes | Called when the user scrolls near the sentinel. |
| `threshold` | `number` | no | Px from bottom before triggering `onLoadMore`. Default 200. |
| `renderItem` | `(item, index) => ReactNode` | yes | Renders one item. |
| `containerClassName` | `string` | no | Layout for the whole grid (columns, gap). |
| `itemClassName` | `string` | no | Per-item wrapper styling. |
| `sentinelClassName` | `string` | no | Styling for the invisible load-trigger element. |

### Usage — Pinterest-style masonry (as used in App.tsx)

```tsx
<Grid
  items={items}
  hasMore={hasNextPage}
  onLoadMore={loadMore}
  containerClassName="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]"
  itemClassName="mb-3 break-inside-avoid"
  renderItem={(item, index) => (
    <img
      src={item.thumbnailUrl}
      alt={item.alt ?? ""}
      className="w-full h-auto rounded-lg cursor-pointer hover:opacity-80"
      onClick={() => handleOpen(index)}
    />
  )}
/>
```

The masonry effect comes from two things together: CSS `columns-*` on the
container (native browser column balancing, no JS height measurement), and
letting each image keep its natural aspect ratio (`h-auto`, not
`object-cover` with a fixed height) so columns end up staggered instead of
uniform.

### Usage — plain uniform grid (alternative)

```tsx
<Grid
  items={items}
  hasMore={hasNextPage}
  onLoadMore={loadMore}
  containerClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
  renderItem={(item, index) => (
    <img src={item.thumbnailUrl} className="w-full h-40 object-cover rounded-lg" />
  )}
/>
```

Swapping `columns-*` for `grid grid-cols-*` (and adding a fixed height +
`object-cover` back) is all it takes to go back to a uniform grid — the
component itself doesn't change.

For full control beyond `renderItem`, use `useGrid` directly and spread
`getGridProps()` / `getItemProps()` / `getSentinelProps()` onto your own
markup.

---

## GridSkeleton

Placeholder blocks shown while `Grid`'s real data is still loading. Mirrors
`Grid`'s own `containerClassName`/`itemClassName` props so the skeleton can
match whatever real layout is in use (masonry or uniform).

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `count` | `number` | no | How many placeholder blocks. Default 8. |
| `containerClassName` | `string` | no | Same layout classes as the real Grid's container. |
| `itemClassName` | `string` | no | Placeholder block styling (background, animation, radius). |
| `getItemStyle` | `(index: number) => CSSProperties` | no | Per-item inline style — used to vary heights for a staggered masonry-skeleton look. |

### Usage (as used in App.tsx)

```tsx
{loading && !items && (
  <GridSkeleton
    count={8}
    containerClassName="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]"
    itemClassName="mb-3 break-inside-avoid rounded-lg bg-neutral-900 animate-pulse"
    getItemStyle={(index) => ({ height: 120 + (index % 4) * 60 })}
  />
)}
```

`getItemStyle` here cycles through 4 heights (120/180/240/300px) so the
skeleton reads as staggered columns rather than a flat wall of identical
boxes — matching what the real masonry `Grid` will look like once data
arrives.

---

## Loader

Single-element, headless loading indicator. No spinner animation ships by
default — you draw it entirely with `className`.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `className` | `string` | no | Visual styling — size, border, spin animation. |
| `label` | `string` | no | Accessible label for screen readers (`aria-label`). Default `"Loading"`. |

### Usage (as used in App.tsx)

```tsx
<Loader className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-300" />
```

Classic "spinning ring" trick: a circular border with one edge
(`border-t-*`) colored differently, animated with Tailwind's `animate-spin`.
`Loader` itself just renders `<div role="status" aria-label={label} className={className} />`.

---

## Lightbox

Overlay with keyboard nav (Escape closes, arrow keys navigate) and a basic
focus trap. Fully headless — style it via className props.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `T[]` | yes | Full item list (for prev/next bounds). |
| `activeIndex` | `number \| null` | yes | `null` = closed. |
| `onClose` | `() => void` | yes | Called on Escape, close button, or click-outside. |
| `onNavigate` | `(nextIndex: number) => void` | yes | Called on arrow keys / prev-next buttons. |
| `renderContent` | `(item) => ReactNode` | yes | Renders the active item. |
| `overlayClassName` | `string` | no | Full-viewport backdrop wrapper. |
| `contentClassName` | `string` | no | Wrapper around `renderContent`'s output. |
| `closeButtonClassName` / `prevButtonClassName` / `nextButtonClassName` | `string` | no | Per-button styling. |

### Usage

```tsx
<Lightbox
  items={items}
  activeIndex={activeIndex}
  onClose={() => setActiveIndex(null)}
  onNavigate={(next) => setActiveIndex(next)}
  overlayClassName="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 backdrop-blur-sm"
  contentClassName="flex max-w-[90vw] items-center justify-center"
  closeButtonClassName="fixed right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
  prevButtonClassName="fixed left-5 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
  nextButtonClassName="fixed right-5 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
  renderContent={(item) => <img src={item.url} />}
/>
```

Click-outside-to-close is built in (fires `onClose` only when the click
target is the overlay itself, not its children). Include `overflow-y-auto`
in `overlayClassName` if content can exceed viewport height — combine with
`fixed` (not `absolute`) positioning on the prev/next/close buttons so they
stay pinned while the overlay scrolls.

---

## ReelSwiper

Vertical snap-paging feed (TikTok/Reels-style). Detects the active item via
`IntersectionObserver` and triggers `onLoadMore` as the user nears the end
of the loaded items — same underlying idea as `Grid`'s sentinel, adapted for
one-item-at-a-time paging instead of a scrolling list.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `T[]` (T extends `{ id }`) | yes | Data to render. |
| `activeIndex` | `number` | yes | Currently active/visible item index. |
| `onActiveChange` | `(index: number) => void` | yes | Called when scroll detects a new active item. |
| `hasMore` | `boolean` | no | Whether more items can be fetched. Default `false` (no load-more trigger). |
| `onLoadMore` | `() => void` | no | Called once as the active item nears the end of the list. |
| `loadMoreThreshold` | `number` | no | Items-from-the-end before `onLoadMore` fires. Default 2. |
| `renderItem` | `(item, isActive) => ReactNode` | yes | Renders one item; `isActive` tells you whether to autoplay/render at full quality. |

### Usage (as used in App.tsx)

```tsx
<div style={{ height: 400, overflowY: "scroll", scrollSnapType: "y mandatory" }}>
  <ReelSwiper
    items={videoItems}
    activeIndex={reelIndex}
    onActiveChange={setReelIndex}
    hasMore={hasNextPage}
    onLoadMore={loadMore}
    renderItem={(item) => (
      <div style={{ height: 400, scrollSnapAlign: "start" }}>
        <video src={item.url} poster={item.thumbnailUrl} controls autoPlay muted loop />
      </div>
    )}
  />
</div>
```

The scroll-snap CSS (`scrollSnapType` on the container, `scrollSnapAlign` on
each item) is **not** applied by `ReelSwiper` itself — you set it, same as
every other visual decision in this package. The hook only handles which
item counts as "active" and when to ask for more data.

---

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
