import { Ref, useCallback, useEffect, useRef } from "react";
import { WithId } from "./types";

export interface UseGridOptions<T extends WithId> {
  items: T[];
  hasMore: boolean;
  onLoadMore: () => void;
  /** Distance in px from the bottom sentinel before triggering onLoadMore. Default 200. */
  threshold?: number;
}

export interface GridItemProps {
  key: string | number;
  "data-grid-item": true;
}

/**
 * Headless infinite-scroll grid. Ships zero markup/styles — you render
 * whatever DOM you want and spread the returned prop-getters onto it.
 * Detection is done via IntersectionObserver on a sentinel element, so no
 * scroll-event listeners or layout thrashing.
 */
export function useGrid<T extends WithId>({ items, hasMore, onLoadMore, threshold = 200 }: UseGridOptions<T>) {
  const sentinelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, threshold]);

  const getGridProps = useCallback(
    () => ({
      role: "list" as const,
      "aria-busy": undefined,
    }),
    []
  );

  const getItemProps = useCallback((item: T): GridItemProps => {
    return { key: item.id, "data-grid-item": true as const };
  }, []);

  const getSentinelProps = useCallback(
    () => ({
      ref: sentinelRef as Ref<HTMLDivElement>,
      "data-grid-sentinel": true as const,
      style: { height: 1 },
    }),
    []
  );

  return { items, getGridProps, getItemProps, getSentinelProps };
}
