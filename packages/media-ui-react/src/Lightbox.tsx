import React from "react";
import { useLightbox, UseLightboxOptions } from "./useLightbox";
import { WithId } from "./types";

export interface LightboxProps<T extends WithId> extends UseLightboxOptions<T> {
  /** Render the active item's content (image/video). You own all markup. */
  renderContent: (item: T) => React.ReactNode;
}

export function Lightbox<T extends WithId>({ renderContent, ...options }: LightboxProps<T>) {
  const { isOpen, activeItem, getOverlayProps, getCloseButtonProps, getNextButtonProps, getPrevButtonProps } =
    useLightbox(options);

  if (!isOpen || !activeItem) return null;

  return (
    <div {...getOverlayProps()}>
      <button {...getCloseButtonProps()}>Close</button>
      <button {...getPrevButtonProps()}>Prev</button>
      {renderContent(activeItem)}
      <button {...getNextButtonProps()}>Next</button>
    </div>
  );
}
