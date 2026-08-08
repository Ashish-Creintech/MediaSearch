// import React from "react";
// import { useLightbox, UseLightboxOptions } from "./useLightbox";
// import { WithId } from "./types";

// export interface LightboxProps<T extends WithId> extends UseLightboxOptions<T> {
//   renderContent: (item: T) => React.ReactNode;
// }

// export function Lightbox<T extends WithId>({
//   renderContent,
//   ...options
// }: LightboxProps<T>) {
//   const {
//     isOpen,
//     activeItem,
//     getOverlayProps,
//     getCloseButtonProps,
//     getNextButtonProps,
//     getPrevButtonProps,
//   } = useLightbox(options);

//   if (!isOpen || !activeItem) return null;

//   return (
//     <div
//       {...getOverlayProps()}
//       className="
//         flex-col
//         bg-black/90
//         absolute inset-0
//         flex items-center justify-center
//         bg-black/90
//         p-4
//         backdrop-blur-sm
//         outline-none
//       "
//       style={{ zIndex: 999 }}
//     >
//       <div className="flex  bg-amber-300 flex-row">
//         {/* Close button */}
//         <button
//           {...getCloseButtonProps()}
//           className="
//           flex h-10 w-10
//           items-center justify-center
//           rounded-full
//           bg-black/60
//           text-xl text-black
//           transition
//           hover:bg-black/80
//         "
//         >
//           Close
//         </button>

//         {/* Previous */}
//         <button
//           {...getPrevButtonProps()}
//           className="
          
//           flex h-12 w-12
//           -translate-y-1/2
//           items-center justify-center
//           rounded-full
//           bg-black/60
//           text-3xl text-black
//           transition
//           hover:bg-black/80
//           disabled:cursor-not-allowed
//           disabled:opacity-30
//         "
//         >
//           ‹
//         </button>
//       </div>
//       {/* Content */}
//       <div
//         className="
//           flex max-h-[90vh] max-w-[90vw]
//           items-center justify-center
//         "
//       >
//         {renderContent(activeItem)}
//       </div>

//       {/* Next */}
//       <button
//         {...getNextButtonProps()}
//         className="
//           absolute right-5 top-1/2 z-50
//           flex h-12 w-12
//           -translate-y-1/2
//           items-center justify-center
//           rounded-full
//           bg-black/60
//           text-3xl text-white
//           transition
//           hover:bg-black/80
//           disabled:cursor-not-allowed
//           disabled:opacity-30
//         "
//       >
//         ›
//       </button>
//     </div>
//   );
// }


import React from "react";
import { useLightbox, UseLightboxOptions } from "./useLightbox";
import { WithId } from "./types";

export interface LightboxProps<T extends WithId> extends UseLightboxOptions<T> {
  /** Render the active item's content (image/video). You own all markup. */
  renderContent: (item: T) => React.ReactNode;

  // Headless: no default styling. Every className below is optional and
  // entirely up to the consumer (App.tsx) — this package ships no CSS.
  /** Full-viewport overlay wrapper. e.g. "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" */
  overlayClassName?: string;
  /** Wrapper around renderContent's output. e.g. "flex max-h-[90vh] max-w-[90vw] items-center justify-center" */
  contentClassName?: string;
  closeButtonClassName?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
}

export function Lightbox<T extends WithId>({
  renderContent,
  overlayClassName,
  contentClassName,
  closeButtonClassName,
  prevButtonClassName,
  nextButtonClassName,
  ...options
}: LightboxProps<T>) {
  const { isOpen, activeItem, getOverlayProps, getCloseButtonProps, getNextButtonProps, getPrevButtonProps } =
    useLightbox(options);

  if (!isOpen || !activeItem) return null;

  return (
    <div
      {...getOverlayProps()}
      className={overlayClassName}
      // click-outside-to-close: only fires when the click target IS the
      // overlay itself, not something inside it
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          options.onClose();
        }
      }}
    >
      <button {...getCloseButtonProps()} className={closeButtonClassName}>
        Close
      </button>
      <button {...getPrevButtonProps()} className={prevButtonClassName}>
        ‹
      </button>

      <div className={contentClassName}>{renderContent(activeItem)}</div>

      <button {...getNextButtonProps()} className={nextButtonClassName}>
        ›
      </button>
    </div>
  );
}