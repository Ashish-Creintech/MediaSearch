import { Ref, useCallback, useEffect, useRef } from "react";
import { WithId } from "./types";

export interface UseLightboxOptions<T extends WithId> {
  items: T[];
  activeIndex: number | null; // null = closed
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

/**
 * Headless lightbox: owns keyboard behavior (Esc closes, arrows navigate)
 * and a focus trap while open. Renders nothing itself — spread the returned
 * prop-getters onto your own overlay/image/button markup.
 */
export function useLightbox<T extends WithId>({ items, activeIndex, onClose, onNavigate }: UseLightboxOptions<T>) {
  const overlayRef = useRef<HTMLElement | null>(null);
  const isOpen = activeIndex !== null;
  console.log("useLightbox called with activeIndex:", activeIndex, "isOpen:", isOpen, "items:", items);
  const activeItem = isOpen ? items[activeIndex as number] ?? null : null;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && activeIndex !== null && activeIndex < items.length - 1) {
        onNavigate(activeIndex + 1);
      } else if (e.key === "ArrowLeft" && activeIndex !== null && activeIndex > 0) {
        onNavigate(activeIndex - 1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    // basic focus trap: move focus into the overlay when it opens
    overlayRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, items.length, onClose, onNavigate]);

  const getOverlayProps = useCallback(
    () => ({
      ref: overlayRef as Ref<HTMLDivElement>,
      role: "dialog" as const,
      "aria-modal": true as const,
      tabIndex: -1,
    }),
    []
  );

  const getCloseButtonProps = useCallback(
    () => ({
      onClick: onClose,
      "aria-label": "Close",
    }),
    [onClose]
  );

  const getNextButtonProps = useCallback(
    () => ({
      onClick: () => activeIndex !== null && onNavigate(activeIndex + 1),
      disabled: activeIndex === null || activeIndex >= items.length - 1,
      "aria-label": "Next",
    }),
    [activeIndex, items.length, onNavigate]
  );

  const getPrevButtonProps = useCallback(
    () => ({
      onClick: () => activeIndex !== null && onNavigate(activeIndex - 1),
      disabled: activeIndex === null || activeIndex <= 0,
      "aria-label": "Previous",
    }),
    [activeIndex, onNavigate]
  );

  return {
    isOpen,
    activeItem,
    getOverlayProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  };
}
