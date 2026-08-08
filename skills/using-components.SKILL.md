# Skill: Using media-ui-react Components

Use this when building UI markup with Grid, Lightbox, or ReelSwiper from
`media-ui-react`. These components are headless: no styles ship with them,
and they know nothing about Pexels or the SDK.

## Rule: components take plain data via props only
Never import anything from `media-react` or `media-core` inside
`media-ui-react` code, and never pass a `MediaClient` or a hook result
directly into these components without first extracting plain data
(`items`, callbacks). The wiring between data and display only happens in
`apps/web`.

## Grid
```tsx
<Grid
  items={items}                 // T[] where T has an `id`
  hasMore={hasNextPage}
  onLoadMore={loadMore}
  renderItem={(item, index) => <img src={item.thumbnailUrl} onClick={...} />}
/>
```
Uses IntersectionObserver internally — no scroll listeners to wire up
yourself. If you need custom markup beyond `renderItem`, use `useGrid`
directly and spread `getGridProps()` / `getItemProps()` / `getSentinelProps()`
onto your own elements.

## Lightbox
```tsx
<Lightbox
  items={items}
  activeIndex={activeIndex}     // number | null; null = closed
  onClose={() => setActiveIndex(null)}
  onNavigate={(next) => setActiveIndex(next)}
  renderContent={(item) => <img src={item.url} />}
/>
```
Keyboard behavior is built in: Escape closes, arrow keys navigate — don't
re-implement key handling in the app. Preserve the `role="dialog"` /
`aria-modal` attributes the prop-getters supply; don't strip them when
customizing markup.

## ReelSwiper
```tsx
<ReelSwiper
  items={items}
  activeIndex={activeIndex}
  onActiveChange={setActiveIndex}
  renderItem={(item, isActive) => <div>...</div>}
/>
```
Requires the container to have CSS scroll-snap set by you
(`scrollSnapType: "y mandatory"` on the container, `scrollSnapAlign: "start"`
on each item) — the hook detects the active item via IntersectionObserver but
does not apply snap CSS itself.

## What NOT to do
- Don't add `onClick` fetch calls or `MediaClient` usage inside these
  components — if a component needs new behavior, it should still take it as
  a prop/callback from the app.
- Don't assume item shape beyond `{ id }` — these components are generic;
  don't hardcode `thumbnailUrl` or `url` inside `media-ui-react` itself, only
  in the app's `renderItem`/`renderContent` callbacks.
