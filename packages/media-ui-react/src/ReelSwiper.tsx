import React from "react";
import { useReelSwiper, UseReelSwiperOptions } from "./useReelSwiper";
import { WithId } from "./types";

export interface ReelSwiperProps<T extends WithId> extends UseReelSwiperOptions<T> {
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
}

export function ReelSwiper<T extends WithId>({ items, activeIndex, renderItem, ...options }: ReelSwiperProps<T>) {
  const { getContainerProps, getItemProps } = useReelSwiper({ items, activeIndex, ...options });

  return (
    <div {...getContainerProps()}>
      {items.map((item, index) => (
        <div {...getItemProps(item)}>{renderItem(item, index === activeIndex)}</div>
      ))}
    </div>
  );
}
