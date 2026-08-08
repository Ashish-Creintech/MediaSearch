interface LoaderProps {
  /** Optional label shown below the spinner. */
  label?: string;
  /** Size of the spinner ring in pixels. */
  size?: number;
}

/**
 * Reusable inline loading spinner built with Tailwind. Unlike the
 * full-screen FallbackLoader (used for Suspense), this is a compact,
 * self-contained loader meant to render inside a Grid, ReelSwiper,
 * Lightbox, or any panel that has its own loading state.
 */
export default function Loader({ label = "Loading...", size = 40 }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-neutral-400">
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-gray-400" />
      </div>
      {label && (
        <p className="text-sm font-medium tracking-wide text-neutral-500">
          {label}
        </p>
      )}
    </div>
  );
}
