export default function FallbackLoader() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 text-neutral-100">
      {/* Animated spinner ring */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-gray-400" />
        <div className="absolute inset-0 animate-pulse rounded-full border-4 border-transparent border-b-gray-600" />
      </div>

      {/* Loading label */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium tracking-wide text-neutral-300">
          Loading
        </p>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
