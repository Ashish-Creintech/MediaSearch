# media-sdk-monorepo

## Status

| Package | Status |
|---|---|
| `media-core` | **Done.** Pexels photo search/curated/getById, event emitter, TTL cache. Photos only — video search endpoint not implemented (see Cuts below). |
| `media-react` | **Done.** `MediaProvider`, `useMediaSearch`, `useMediaCurated`, `useMediaItem`, `useMediaEvents`. |
| `media-ui-react` | **Done.** Headless `Grid`, `Lightbox`, `ReelSwiper` — each has a hook + a thin render-prop component. |
| `apps/web` | **Done.** Search → Grid → Lightbox flow wired and building with Vite. Reel section is a wiring demo using photo data (see Cuts). |
| `media-native` | **Stub.** Not built — cut for time. |
| `media-ui-native` | **Stub.** Not built — cut for time. |
| `skills/*.SKILL.md` | **Done.** Written against the real hook/component APIs above. |

## Dependency rules (enforced via package.json, not just convention)

- `media-core` imports nothing from any other package in this repo.
- `media-react` / `media-native` import `media-core` only.
- `media-ui-react` / `media-ui-native` import nothing from any other package
  (not even listed as a `package.json` dependency).
- `apps/web` is the only place `media-react` (data) and `media-ui-react`
  (display) are imported together.

## Running it

```bash
npm install                       # installs everything via workspaces
cp apps/web/.env.example apps/web/.env
# edit apps/web/.env with your real Pexels key
cd apps/web && npm run dev
```

To sanity-check `media-core` alone against the real API:
```bash
cd packages/media-core
npm install -D tsx
PEXELS_API_KEY=your_key npx tsx smoke-test.ts
```

## Cuts made under time pressure (documented, not silent)

- **Video support**: Pexels has a separate `/videos` endpoint; `media-core`
  only implements the photo `/v1` endpoints. The app's "Reels" section uses
  `ReelSwiper` against photo data to demonstrate the wiring pattern — adding
  real video would mean adding a `searchVideos` method to `media-core` and
  passing its results into the same `ReelSwiper`; no change needed in
  `media-ui-react`.
- **React Native (`media-native`, `media-ui-native`)**: left as stubs.
  `media-react`'s hook names/shapes are the contract these should mirror if
  built out later.
- **Lightbox video playback**: not built, since video isn't wired in yet.

## AI-assisted vs hand-written

TODO — fill in honestly before submission: which files/functions you wrote
vs. generated, and how the two SKILL.md files were tested against an AI tool
while building `apps/web`.
