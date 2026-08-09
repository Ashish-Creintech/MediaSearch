// import React, { useState } from "react";
// import {
//   MediaProvider,
//   useMediaSearch,
//   useVideoSearch,
//   useMediaEvents,
// } from "media-react";
// import { Grid, Lightbox, ReelSwiper } from "media-ui-react";
// import type { MediaItem } from "media-core";

// const API_KEY = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;

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
//   const {
//     data: videoItems,
//     loading: videoLoading,
//     hasNextPage: hasMoreVideos,
//     loadMore: loadMoreVideos,
//   } = useVideoSearch(query);
//   const { trackView, trackDownload } = useMediaEvents();
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);
//   const [reelIndex, setReelIndex] = useState(0);
//   const [imageLoading, setImageLoading] = useState(true);

//   const handleOpen = (index: number) => {
//     setActiveIndex(index);
//     setImageLoading(true);
//     if (items?.[index]) trackView(items[index].id);
//   };

//   return (
//     <div className="min-h-screen bg-neutral-950 text-neutral-100">
//       <div
//         className="flex flex-row justify-center relative mx-auto"
//         style={{
//           fontFamily: "sans-serif",
//           padding: 24,
//           maxWidth: 1180,
//         }}
//       >
//         {/* Left column: search + results grid */}
//         <div className="flex-1 min-w-0">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               setQuery(inputValue.trim());
//             }}
//             className="mb-6"
//           >
//             <div className="relative w-full max-w-md">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
//                 🔍
//               </span>
//               <input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Search Pexels..."
//                 className="w-full pl-10 pr-28 py-3 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/60 focus:border-gray/60"
//               />
//               <button
//                 type="submit"
//                 className="absolute cursor-pointer right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-gray-500 text-neutral-950 text-sm font-semibold hover:bg-gray-400 transition-colors"
//               >
//                 Search
//               </button>
//             </div>
//           </form>

//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-xl font-semibold tracking-tight text-neutral-100">
//               Media Search
//             </h1>
//             {query && (
//               <span className="text-sm text-neutral-500">
//                 results for “{query}”
//               </span>
//             )}
//           </div>

//           {error && (
//             <p className="text-red-400 text-sm mb-4">Error: {error.message}</p>
//           )}
//           {loading && !items && <Loader label="Loading media..." />}

//           {items && (
//             <Grid
//               items={items}
//               hasMore={hasNextPage}
//               onLoadMore={loadMore}
// renderItem={(item: MediaItem, index) => (
//                 <img
//                   src={item.thumbnailUrl}
//                   alt={item.alt ?? ""}
//                   className="w-full rounded-lg object-cover cursor-pointer transition-opacity duration-150 hover:opacity-80"
//                   onClick={() => handleOpen(index)}
//                   loading="lazy"
//                 />
//               )}
//             />
//           )}
//         </div>

//         {/* Right column: Reels, visually separated in its own panel */}
//         {(videoItems && videoItems.length > 0) || videoLoading ? (
//           <aside className="hidden lg:block w-[300px] shrink-0 ml-8">
//             <div className="sticky top-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
//               <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 px-1 mb-3">
//                 Reels
//               </h2>
//               <div
//                 className="scrollbar-none rounded-xl overflow-hidden bg-black"
//                 style={{
//                   height: 400,
//                   overflowY: "scroll",
//                   scrollSnapType: "y mandatory",
//                 }}
//               >
//                 {videoLoading && !videoItems ? (
//                   <Loader label="Loading reels..." />
//                 ) : (
//                   <ReelSwiper
//                     items={videoItems ?? []}
//                     activeIndex={reelIndex}
//                     onActiveChange={setReelIndex}
//                     hasMore={hasMoreVideos}
//                     onLoadMore={loadMoreVideos}
//                     renderItem={(item: MediaItem) => (
//                       <div
//                         style={{
//                           height: 400,
//                           scrollSnapAlign: "start",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           position: "relative",
//                         }}
//                       >
//                         <video
//                           src={item.url}
//                           poster={item.thumbnailUrl}
//                           style={{ maxHeight: "100%" }}
//                           className="rounded-lg"
//                           controls
//                           autoPlay
//                           muted
//                           loop
//                           onPlay={() => trackView(item.id)}
//                         />
//                       </div>
//                     )}
//                   />
//                 )}
//               </div>
//             </div>
//           </aside>
//         ) : null}
//       </div>

//       {/* On small screens the panel above is hidden; show Reels stacked below the grid instead */}
//       {(videoItems && videoItems.length > 0) || videoLoading ? (
//         <div
//           className="lg:hidden mx-auto px-6 pb-10"
//           style={{ maxWidth: 1180 }}
//         >
//           <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 mb-3">
//             Reels
//           </h2>
//           <div
//             className="scrollbar-none rounded-xl overflow-hidden bg-black border border-neutral-800"
//             style={{
//               height: 400,
//               overflowY: "scroll",
//               scrollSnapType: "y mandatory",
//             }}
//           >
//             {videoLoading && !videoItems ? (
//               <Loader label="Loading reels..." />
//             ) : (
//               <ReelSwiper
//                 items={videoItems ?? []}
//                 activeIndex={reelIndex}
//                 onActiveChange={setReelIndex}
//                 hasMore={hasMoreVideos}
//                 onLoadMore={loadMoreVideos}
//                 renderItem={(item: MediaItem) => (
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
//                     <video
//                       src={item.url}
//                       poster={item.thumbnailUrl}
//                       style={{ maxHeight: "100%" }}
//                       className="rounded-lg"
//                       controls
//                       autoPlay
//                       muted
//                       loop
//                       onPlay={() => trackView(item.id)}
//                     />
//                   </div>
//                 )}
//               />
//             )}
//           </div>
//         </div>
//       ) : null}

//       {/*
//         Lightbox: fully styled here in the app via className slots (the
//         component itself in media-ui-react stays headless/unstyled).
//         overlayClassName includes overflow-y-auto so the lightbox scrolls
//         when the image + buttons + caption together are taller than the
//         viewport, instead of clipping/cutting content off.
//       */}
//       <Lightbox
//         items={items ?? []}
//         activeIndex={activeIndex}
//         onClose={() => {
//           setActiveIndex(null);
//           setImageLoading(true);
//         }}
//         onNavigate={(next) => {
//           setActiveIndex(next);
//           setImageLoading(true);
//           const item = items?.[next];
//           if (item) trackView(item.id);
//         }}
//         overlayClassName="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-black/90 p-4 py-10 backdrop-blur-sm outline-none"
//         contentClassName="flex max-w-[90vw] items-center justify-center"
//         closeButtonClassName="fixed right-5 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white transition hover:bg-black/80"
//         prevButtonClassName="fixed left-5 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
//         nextButtonClassName="fixed right-5 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
// renderContent={(item: MediaItem) => (
//           <div className="flex flex-col items-center gap-4">
//             {imageLoading && <Loader label="Loading image..." />}
//             <img
//               src={item.url}
//               alt={item.alt ?? ""}
//               onLoad={() => setImageLoading(false)}
//               className={`max-h-[75vh] max-w-[90vw] rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${
//                 imageLoading ? "opacity-0" : "opacity-100"
//               }`}
//             />

//             <div className="flex items-center gap-4 text-white">
//               <button
//                 onClick={() => trackDownload(item.id)}
//                 className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-200"
//               >
//                 Download
//               </button>

//               {item.photographer && (
//                 <span className="text-sm text-gray-300">
//                   Photo by {item.photographer}
//                 </span>
//               )}
//             </div>
//           </div>
//         )}
//       />
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
import Loader from "./component/Loader";
import GridSkeleton from "./component/GridSkeleton";

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
  const {
    data: items,
    loading,
    error,
    hasNextPage,
    loadMore,
  } = useMediaSearch(query);
  const {
    data: videoItems,
    hasNextPage: hasMoreVideos,
    loadMore: loadMoreVideos,
  } = useVideoSearch(query);
  const { trackView, trackDownload } = useMediaEvents();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reelIndex, setReelIndex] = useState(0);

  const handleOpen = (index: number) => {
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
        <div className="flex-1 min-w-0 relative">
          <h1 className="text-xl font-semibold absolute top-0 right-5 tracking-tight text-neutral-100">
            Media Search
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(inputValue.trim());
            }}
            className="mb-6 fixed top-0.5 z-50"
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
            {query && (
              <span className="text-sm text-neutral-500">
                results for “{query}”
              </span>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">Error: {error.message}</p>
          )}
          {loading && !items && <GridSkeleton />}

          {items && (
            <Grid
              items={items}
              hasMore={hasNextPage}
              onLoadMore={loadMore}
              containerClassName="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]"
              itemClassName="mb-3 break-inside-avoid"
              renderItem={(item: MediaItem, index) => (
                <img
                  src={item.thumbnailUrl}
                  alt={item.alt ?? ""}
                  className="w-full h-auto rounded-lg cursor-pointer transition-opacity duration-150 hover:opacity-80"
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
                  hasMore={hasMoreVideos}
                  onLoadMore={loadMoreVideos}
                  renderItem={(item: MediaItem) => (
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
              hasMore={hasMoreVideos}
              onLoadMore={loadMoreVideos}
              renderItem={(item: MediaItem) => (
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
        Lightbox: fully styled here in the app via className slots (the
        component itself in media-ui-react stays headless/unstyled).
        overlayClassName includes overflow-y-auto so the lightbox scrolls
        when the image + buttons + caption together are taller than the
        viewport, instead of clipping/cutting content off.
      */}
      <Lightbox
        items={items ?? []}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={(next) => {
          setActiveIndex(next);
          const item = items?.[next];
          if (item) trackView(item.id);
        }}
        overlayClassName="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-black/90 p-4 py-10 backdrop-blur-sm outline-none"
        contentClassName="flex max-w-[90vw] items-center justify-center"
        closeButtonClassName="fixed right-5 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white transition hover:bg-black/80"
        prevButtonClassName="fixed left-5 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
        nextButtonClassName="fixed right-5 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
        renderContent={(item: MediaItem) => (
          <div className="flex flex-col items-center gap-4">
            <img
              src={item.url}
              alt={item.alt ?? ""}
              className="max-h-[75vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />

            <div className="flex items-center gap-4 text-white">
              <button
                onClick={() => trackDownload(item.id)}
                className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-200"
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
        )}
      />
    </div>
  );
}
