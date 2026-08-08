// import React, { useState } from "react";
// import {
//   MediaProvider,
//   useMediaSearch,
//   useVideoSearch,
//   useMediaEvents,
// } from "media-react";
// import { Grid, Lightbox, ReelSwiper } from "media-ui-react";
// import type { MediaItem } from "media-core";
// import Modal from "react-modal";

// const API_KEY = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;

// Modal.setAppElement("#root");

// export default function App() {
//   if (!API_KEY) {
//     return (
//       <div style={{ padding: 24, fontFamily: "sans-serif" }}>
//         Missing VITE_PEXELS_API_KEY. Copy .env.example to .env and add your key,
//         then restart the dev server.
//       </div>
//     );
//   }

//   return (
//     <MediaProvider apiKey={API_KEY}>
//       <SearchScreen />
//     </MediaProvider>
//   );
// }

// function SearchScreen() {
//   const [query, setQuery] = useState("mountains");
//   const [inputValue, setInputValue] = useState(query);
//   const {
//     data: items,
//     loading,
//     error,
//     hasNextPage,
//     loadMore,
//   } = useMediaSearch(query);
//   const { data: videoItems } = useVideoSearch(query);
//   const { trackView, trackDownload } = useMediaEvents();
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);
//   const [reelIndex, setReelIndex] = useState(0);

//   const handleOpen = (index: number) => {
//     console.log("handleOpen called with index:", index,items?.[index]);
//     setActiveIndex(index);
//     if (items?.[index]) trackView(items[index].id);
//   };

//   return (
//     <div
//       className="flex flex-row justify-center relative"
//       style={{
//         fontFamily: "sans-serif",
//         padding: 24,
//         maxWidth: 960,
//         margin: "0 auto",
//       }}
//     >
//       <div className="">
//          <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             setQuery(inputValue.trim());
//           }}
//           style={{ marginBottom: 16 }}
//         >
//           <div className="relative w-80">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               🔍
//             </span>
//             <input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder="Search Pexels..."
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
//             Search
//           </button>
//         </form>
//         <div className="flex flex-col gap-2">
//         <h1>Media Search</h1>

//         {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
//         {loading && !items && <p>Loading...</p>}

//         {items && (
//           <Grid
//             items={items}
//             hasMore={hasNextPage}
//             onLoadMore={loadMore}
//             renderItem={(item: MediaItem, index) => (
//               <img
//                 src={item.thumbnailUrl}
//                 alt={item.alt ?? ""}
//                 style={{
//                   width: "100%",
//                   height: 160,
//                   objectFit: "cover",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => handleOpen(index)}
//               />
//             )}
//           />
//         )}
//       </div>
//       </div>

//      <Lightbox
//   items={items ?? []}
//   activeIndex={activeIndex}
//   onClose={() => setActiveIndex(null)}
//   onNavigate={(next) => {
//     setActiveIndex(next);

//     const item = items?.[next];

//     if (item) {
//       trackView(item.id);
//     }
//   }}
//   renderContent={(item: MediaItem) => (
//     <div className="flex flex-col items-center gap-4">
//       <img
//         src={item.url}
//         alt={item.alt ?? ""}
//         className="
//           max-h-[80vh]
//           max-w-[90vw]
//           rounded-lg
//           object-contain
//           shadow-2xl
//         "
//       />

//       <div className="flex items-center gap-4 text-white">
//         <button
//           onClick={() => trackDownload(item.id)}
//           className="
//           cursor-pointer
//             rounded-md
//             bg-white
//             px-4 py-2
//             text-sm
//             text-black
//             font-bold
//             transition
//             hover:bg-gray-200
//           "
//         >
//           Download
//         </button>

//         {item.photographer && (
//           <span className="text-sm text-gray-300">
//             Photo by {item.photographer}
//           </span>
//         )}
//       </div>
//     </div>
//   )}
// />

//       {/* Real video results from Pexels' /videos endpoint, via useVideoSearch. */}
//       {videoItems && videoItems.length > 0 && (
//         <div className="flex flex-col">
//           <h2>Reels</h2>
//           <div
//             className="scrollbar-none"
//             style={{
//               height: 400,
//               overflowY: "scroll",
//               scrollSnapType: "y mandatory",
//             }}
//           >
//             <ReelSwiper
//               items={videoItems}
//               activeIndex={reelIndex}
//               onActiveChange={setReelIndex}
//               renderItem={(item: MediaItem, isActive) => (
//                 <>
//                   {console.log("item.urlitem.urlitem.url for video", item.url)}
//                   <div
//                     style={{
//                       height: 400,
//                       scrollSnapAlign: "start",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       position: "relative",
//                     }}
//                   >
//                     {/* {isActive ? ( */}
//                     <video
//                       src={item.url}
//                       poster={item.thumbnailUrl}
//                       style={{ maxHeight: "100%" }}
//                       controls
//                       autoPlay
//                       muted
//                       loop
//                       onPlay={() => trackView(item.id)}
//                     />
//                     {/* ) : (
//                     <img src={item.thumbnailUrl} alt="" style={{ maxHeight: "100%" }} />
//                   )} */}
//                   </div>
//                 </>
//               )}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  MediaProvider,
  useMediaSearch,
  useVideoSearch,
  useMediaEvents,
} from "media-react";
import { Grid, Lightbox, ReelSwiper } from "media-ui-react";
import type { MediaItem } from "media-core";
import Modal from "react-modal";

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;

Modal.setAppElement("#root");

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
  const {
    data: items,
    loading,
    error,
    hasNextPage,
    loadMore,
  } = useMediaSearch(query);
  const { data: videoItems } = useVideoSearch(query);
  const { trackView, trackDownload } = useMediaEvents();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reelIndex, setReelIndex] = useState(0);

  const handleOpen = (index: number) => {
    console.log("handleOpen called with index:", index, items?.[index]);
    setActiveIndex(index);
    if (items?.[index]) trackView(items[index].id);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div
        className="flex flex-row justify-center relative mx-auto"
        style={{
          fontFamily: "sans-serif",
          padding: 24,
          maxWidth: 1180,
        }}
      >
        {/* Left column: search + results grid */}
        <div className="flex-1 min-w-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(inputValue.trim());
            }}
            className="mb-6"
          >
            <div className="relative w-full max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                🔍
              </span>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search Pexels..."
                className="w-full pl-10 pr-28 py-3 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/60 focus:border-gray/60"
              />
              <button
                type="submit"
                className="absolute cursor-pointer right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-gray-500 text-neutral-950 text-sm font-semibold hover:bg-gray-400 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-100">
              Media Search
            </h1>
            {query && (
              <span className="text-sm text-neutral-500">
                results for “{query}”
              </span>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">Error: {error.message}</p>
          )}
          {loading && !items && (
            <p className="text-neutral-500 text-sm">Loading...</p>
          )}

          {items && (
            <Grid
              items={items}
              hasMore={hasNextPage}
              onLoadMore={loadMore}
              renderItem={(item: MediaItem, index) => (
                <img
                  src={item.thumbnailUrl}
                  alt={item.alt ?? ""}
                  className="h-fit w-full object-cover rounded-lg cursor-pointer transition-opacity duration-150 hover:opacity-80"
                  onClick={() => handleOpen(index)}
                />
              )}
            />
          )}
        </div>

        {/* Right column: Reels, visually separated in its own panel */}
        {videoItems && videoItems.length > 0 && (
          <aside className="hidden lg:block w-[300px] shrink-0 ml-8">
            <div className="sticky top-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 px-1 mb-3">
                Reels
              </h2>
              <div
                className="scrollbar-none rounded-xl overflow-hidden bg-black"
                style={{
                  height: 400,
                  overflowY: "scroll",
                  scrollSnapType: "y mandatory",
                }}
              >
                <ReelSwiper
                  items={videoItems}
                  activeIndex={reelIndex}
                  onActiveChange={setReelIndex}
                  renderItem={(item: MediaItem, isActive) => (
                    <>
                      {console.log(
                        "item.urlitem.urlitem.url for video",
                        item.url,
                      )}
                      <div
                        style={{
                          height: 400,
                          scrollSnapAlign: "start",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        {/* {isActive ? ( */}
                        <video
                          src={item.url}
                          poster={item.thumbnailUrl}
                          style={{ maxHeight: "100%" }}
                          className="rounded-lg"
                          controls
                          autoPlay
                          muted
                          loop
                          onPlay={() => trackView(item.id)}
                        />
                        {/* ) : (
                        <img src={item.thumbnailUrl} alt="" style={{ maxHeight: "100%" }} />
                      )} */}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* On small screens the panel above is hidden; show Reels stacked below the grid instead */}
      {videoItems && videoItems.length > 0 && (
        <div
          className="lg:hidden mx-auto px-6 pb-10"
          style={{ maxWidth: 1180 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 mb-3">
            Reels
          </h2>
          <div
            className="scrollbar-none rounded-xl overflow-hidden bg-black border border-neutral-800"
            style={{
              height: 400,
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
            }}
          >
            <ReelSwiper
              items={videoItems}
              activeIndex={reelIndex}
              onActiveChange={setReelIndex}
              renderItem={(item: MediaItem, isActive) => (
                <div
                  style={{
                    height: 400,
                    scrollSnapAlign: "start",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <video
                    src={item.url}
                    poster={item.thumbnailUrl}
                    style={{ maxHeight: "100%" }}
                    className="rounded-lg"
                    controls
                    autoPlay
                    muted
                    loop
                    onPlay={() => trackView(item.id)}
                  />
                </div>
              )}
            />
          </div>
        </div>
      )}

      {/*
        Lightbox as a proper modal: full-viewport dim/blur backdrop, centered
        content, explicit close button and click-outside-to-close, plus a
        keyboard Escape handler. If media-ui-react's <Lightbox> already renders
        its own backdrop/overlay wrapper internally, check its props for an
        overlayClassName / className hook and move the backdrop styling there
        instead of double-wrapping like below.
      */}
      <Lightbox
        items={items ?? []}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={(next) => {
          setActiveIndex(next);

          const item = items?.[next];

          if (item) {
            trackView(item.id);
          }
        }}
      renderContent={(item: MediaItem) =>
  loading ? (
    <div className="flex flex-col items-center justify-center gap-3 text-white">
      <div
        className="
          h-10 w-10
          animate-spin
          rounded-full
          border-4
          border-white/20
          border-t-white
        "
      />

      <span className="text-sm text-red-500 font-bold">
        Loading...
      </span>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4">
      <img
        src={item.url}
        alt={item.alt ?? ""}
        className="
          max-h-[80vh]
          max-w-[90vw]
          rounded-lg
          object-contain
          shadow-2xl
        "
      />

      <div className="flex items-center gap-4 text-white">
        <button
          onClick={() => trackDownload(item.id)}
          className="
            cursor-pointer
            rounded-md
            bg-white
            px-4 py-2
            text-sm
            font-bold
            text-black
            transition
            hover:bg-gray-200
          "
        >
          Download
        </button>

        {item.photographer && (
          <span className="text-sm text-gray-300">
            Photo by {item.photographer}
          </span>
        )}
      </div>
    </div>
  )
}
      />
    </div>
  );
}
