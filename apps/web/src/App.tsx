import React, { useState } from "react";
import { MediaProvider, useMediaSearch, useMediaEvents } from "media-react";
import { Grid, Lightbox, ReelSwiper } from "media-ui-react";
import type { MediaItem } from "media-core";

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;

export default function App() {
  if (!API_KEY) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        Missing VITE_PEXELS_API_KEY. Copy .env.example to .env and add your key,
        then restart the dev server.
      </div>
    );
  }

  return (
    <MediaProvider apiKey={API_KEY}>
      <SearchScreen />
    </MediaProvider>
  );
}

function SearchScreen() {
  const [query, setQuery] = useState("mountains");
  const [inputValue, setInputValue] = useState(query);
  const { data: items, loading, error, hasNextPage, loadMore } = useMediaSearch(query);
  const { trackView, trackDownload } = useMediaEvents();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    if (items?.[index]) trackView(items[index].id);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>Media Search</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(inputValue.trim());
        }}
        style={{ marginBottom: 16 }}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search Pexels..."
          style={{ padding: 8, width: 280 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
          Search
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {loading && !items && <p>Loading...</p>}

      {items && (
        <Grid
          items={items}
          hasMore={hasNextPage}
          onLoadMore={loadMore}
          renderItem={(item: MediaItem, index) => (
            <img
              src={item.thumbnailUrl}
              alt={item.alt ?? ""}
              style={{ width: "100%", height: 160, objectFit: "cover", cursor: "pointer" }}
              onClick={() => handleOpen(index)}
            />
          )}
        />
      )}

      <Lightbox
        items={items ?? []}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={(next) => {
          setActiveIndex(next);
          const item = items?.[next];
          if (item) trackView(item.id);
        }}
        renderContent={(item: MediaItem) => (
          <div>
            <img src={item.url} alt={item.alt ?? ""} style={{ maxWidth: "90vw", maxHeight: "80vh" }} />
            <div>
              <button onClick={() => trackDownload(item.id)}>Download</button>
              {item.photographer && <span style={{ marginLeft: 8 }}>Photo by {item.photographer}</span>}
            </div>
          </div>
        )}
      />

      {/*
        NOTE: media-core's Pexels client only implements the photo search
        endpoint (scoped for time -- see README). This ReelSwiper section
        demonstrates the wiring pattern using photo items in place of real
        video results; swapping in true video data only requires adding a
        video-search method to media-core and passing its results here --
        media-ui-react's ReelSwiper does not need to change.
      */}
      {items && items.length > 0 && (
        <>
          <h2>Reels (demo, photo items)</h2>
          <div style={{ height: 400, overflowY: "scroll", scrollSnapType: "y mandatory" }}>
            <ReelSwiper
              items={items}
              activeIndex={0}
              onActiveChange={() => {}}
              renderItem={(item: MediaItem) => (
                <div
                  style={{
                    height: 400,
                    scrollSnapAlign: "start",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={item.thumbnailUrl} alt={item.alt ?? ""} style={{ maxHeight: "100%" }} />
                </div>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
