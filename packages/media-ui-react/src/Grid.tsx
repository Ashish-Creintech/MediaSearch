import React from "react";
import { useGrid, UseGridOptions } from "./useGrid";
import { WithId } from "./types";

export interface GridProps<T extends WithId> extends UseGridOptions<T> {
  /** Render one item. You own all markup/styling. */
  renderItem: (item: T, index: number) => React.ReactNode;
}

/**
 * Convenience wrapper over useGrid for consumers who don't need to manage
 * the hook themselves. Still headless: no CSS, no assumptions about item
 * shape beyond `id`. Prefer useGrid directly if you need more control.
 */
export function Grid<T extends WithId>({ renderItem, ...options }: GridProps<T>) {
  const { items, getGridProps, getItemProps, getSentinelProps } = useGrid(options);

  return (
    <div {...getGridProps()}>
      {items.map((item, index) => (
        <div  className="flex flex-col gap-5" {...getItemProps(item)}>{renderItem(item, index)}</div>
      ))}
      <div {...getSentinelProps()} />
    </div>
  );
}
