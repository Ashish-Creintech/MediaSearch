import { Ref, useCallback, useEffect, useRef } from "react";
import { WithId } from "./types";

export interface UseReelSwiperOptions<T extends WithId> {
  items: T[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
}

/**
 * Headless vertical reel/swiper. Detects which item is "active" (most
 * visible) as the user scrolls through a snap-scrolling container, using
 * IntersectionObserver rather than scroll-position math. No styles shipped —
 * you supply the CSS scroll-snap rules on the container/items yourself.
 */
export function useReelSwiper<T extends WithId>({ items, activeIndex, onActiveChange }: UseReelSwiperOptions<T>) {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Map<string | number, HTMLElement>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick whichever observed entry has the highest visible ratio
        const mostVisible = entries.reduce((best, entry) =>
          entry.intersectionRatio > (best?.intersectionRatio ?? 0) ? entry : best
        , entries[0]);

        if (mostVisible?.isIntersecting) {
          const id = (mostVisible.target as HTMLElement).dataset.reelId;
          const index = items.findIndex((item) => String(item.id) === id);
          if (index !== -1 && index !== activeIndex) {
            onActiveChange(index);
          }
        }
      },
      { root: container, threshold: [0.6] }
    );

    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, activeIndex, onActiveChange]);

  const getContainerProps = useCallback(
    () => ({
      ref: containerRef as Ref<HTMLDivElement>,
      "data-reel-container": true as const,
    }),
    []
  );

  const getItemProps = useCallback(
    (item: T) => ({
      key: item.id,
      "data-reel-id": String(item.id),
      ref: (el: HTMLElement | null) => {
        if (el) itemRefs.current.set(item.id, el);
        else itemRefs.current.delete(item.id);
      },
    }),
    []
  );

  return { getContainerProps, getItemProps, activeItem: items[activeIndex] ?? null };
}
