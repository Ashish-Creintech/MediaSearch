/**
 * Masonry-style skeleton loader for the photo grid.
 * Renders a Pinterest-like layout of pulsing placeholder tiles with
 * varied heights, matching the real masonry grid (1/2/3 columns).
 */
export default function GridSkeleton() {
  // Pseudo-random tile heights so the skeleton mirrors a masonry feed.
  const heights = [
    "h-40",
    "h-64",
    "h-52",
    "h-80",
    "h-48",
    "h-72",
    "h-56",
    "h-36",
    "h-68",
    "h-44",
    "h-76",
    "h-60",
    "h-40",
    "h-64",
    "h-52",
    "h-80",
    "h-48",
    "h-72",
    "h-56",
    "h-36",
    "h-68",
    "h-44",
    "h-76",
    "h-60",
  ];

  return (
    <div
      role="status"
      aria-label="Loading grid"
      className="columns-1 gap-4 sm:columns-2 lg:columns-3"
    >
      {heights.map((h, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <div
            className={`w-full ${h} animate-pulse rounded-lg bg-neutral-800`}
          />
        </div>
      ))}
    </div>
  );
}
