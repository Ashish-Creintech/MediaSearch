import React from "react";
import { useLightbox, UseLightboxOptions } from "./useLightbox";
import { WithId } from "./types";

export interface LightboxProps<T extends WithId> extends UseLightboxOptions<T> {
  renderContent: (item: T) => React.ReactNode;
}

export function Lightbox<T extends WithId>({
  renderContent,
  ...options
}: LightboxProps<T>) {
  const {
    isOpen,
    activeItem,
    getOverlayProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox(options);

  if (!isOpen || !activeItem) return null;

  return (
    <div
      {...getOverlayProps()}
      className="
        flex-col
        bg-black/90
        absolute inset-0
        flex items-center justify-center
        bg-black/90
        p-4
        backdrop-blur-sm
        outline-none
      "
      style={{ zIndex: 999 }}
    >
      <div className="flex  bg-amber-300 flex-row">
        {/* Close button */}
        <button
          {...getCloseButtonProps()}
         className="
          absolute right-5 top-1/2 z-50
          flex h-12 w-12
          -translate-y-1/2
          items-center justify-center
          rounded-full
          bg-black/60
          text-3xl text-white
          transition
          hover:bg-black/80
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
        >
          Close
        </button>

        {/* Previous */}
        <button
          {...getPrevButtonProps()}
          className="
          absolute right-5 top-1/2 z-50
          flex h-12 w-12
          -translate-y-1/2
          items-center justify-center
          rounded-full
          bg-black/60
          text-3xl text-white
          transition
          hover:bg-black/80
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
        >
          ‹
        </button>
      </div>
      {/* Content */}
      <div
        className="
          flex max-h-[90vh] max-w-[90vw]
          items-center justify-center
        "
      >
        {renderContent(activeItem)}
      </div>

      {/* Next */}
      <button
        {...getNextButtonProps()}
        className="
          absolute right-5 top-1/2 z-50
          flex h-12 w-12
          -translate-y-1/2
          items-center justify-center
          rounded-full
          bg-black/60
          text-8xl text-white
          transition
          hover:bg-black/80
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        ›
      </button>
    </div>
  );
}
