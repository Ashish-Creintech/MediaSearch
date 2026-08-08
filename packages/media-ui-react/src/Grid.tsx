// import React from "react";
// import { useGrid, UseGridOptions } from "./useGrid";
// import { WithId } from "./types";

// export interface GridProps<T extends WithId> extends UseGridOptions<T> {
//   /** Render one item. You own all markup/styling. */
//   renderItem: (item: T, index: number) => React.ReactNode;
//   /** Optional className for the grid container (defaults to a masonry layout). */
//   containerClassName?: string;
//   /** Optional className for each item wrapper (defaults to masonry-friendly). */
//   itemClassName?: string;
// }

// /**
//  * Convenience wrapper over useGrid for consumers who don't need to manage
//  * the hook themselves. Still headless: no CSS assumptions about item shape
//  * beyond `id`. The default layout is a Pinterest-style masonry grid built
//  * with CSS columns (responsive 1/2/3 columns). Override with the className
//  * props if you need a different layout. Prefer useGrid directly if you need
//  * more control.
//  */
// export function Grid<T extends WithId>({
//   renderItem,
//   containerClassName = "columns-1 gap-4 sm:columns-2 lg:columns-3",
//   itemClassName = "mb-4 break-inside-avoid",
//   ...options
// }: GridProps<T>) {
//   const { items, getGridProps, getItemProps, getSentinelProps } = useGrid(options);

//   return (
//     <div {...getGridProps()} className={containerClassName}>
//       {items.map((item, index) => (
//         <div className={itemClassName} {...getItemProps(item)}>{renderItem(item, index)}</div>
//       ))}
//       <div {...getSentinelProps()} />
//     </div>
//   );
// }


import React from "react";
import { useGrid, UseGridOptions } from "./useGrid";
import { WithId } from "./types";

export interface GridProps<T extends WithId> extends UseGridOptions<T> {
  /** Render one item. You own all markup/styling. */
  renderItem: (item: T, index: number) => React.ReactNode;

  // Headless: no default styling. All optional, entirely up to the
  // consumer (App.tsx) — this package ships no CSS. Use containerClassName
  // to control layout (e.g. CSS columns for a Pinterest-style masonry grid,
  // or a plain CSS grid) and itemClassName for per-item spacing/breaking.
  containerClassName?: string;
  itemClassName?: string;
  sentinelClassName?: string;
}

/**
 * Convenience wrapper over useGrid for consumers who don't need to manage
 * the hook themselves. Still headless: layout is entirely controlled via
 * the className props above. Prefer useGrid directly if you need more
 * control over markup structure.
 */
export function Grid<T extends WithId>({
  renderItem,
  containerClassName,
  itemClassName,
  sentinelClassName,
  ...options
}: GridProps<T>) {
  const { items, getGridProps, getItemProps, getSentinelProps } = useGrid(options);

  return (
    <div {...getGridProps()} className={containerClassName}>
      {items.map((item, index) => (
        <div {...getItemProps(item)} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
      <div {...getSentinelProps()} className={sentinelClassName} />
    </div>
  );
}