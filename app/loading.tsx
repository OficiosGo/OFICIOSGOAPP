export default function Loading() {
  return (
    <>
      {/* Header skeleton */}
      <div
        className="sticky top-0 z-30 px-4 pt-4 pb-4 rounded-b-[24px]"
        style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}
      >
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-3 w-56 bg-white/5 rounded mt-2 mb-3 animate-pulse" />

        {/* Input skeleton */}
        <div className="flex bg-white/10 rounded-2xl overflow-hidden border border-white/10 h-[46px]">
          <div className="flex-1 flex items-center gap-2.5 px-3.5">
            <div className="w-4 h-4 bg-white/15 rounded-full animate-pulse" />
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="shrink-0 w-[72px] bg-[#F8C927]/40 animate-pulse" />
        </div>

        {/* Chips skeleton */}
        <div className="flex gap-2 mt-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="shrink-0 h-7 w-24 bg-white/10 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Results skeleton */}
      <div className="px-4 pt-4 pb-24">
        <div className="h-3 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-200 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-2.5 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-2.5 w-12 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}