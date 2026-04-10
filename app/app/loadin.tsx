export default function Loading() {
    return (
      <>
        {/* Header skeleton */}
        <div
          className="relative overflow-hidden rounded-b-[32px] px-5 pt-4 pb-6"
          style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          </div>
  
          <div className="h-3 w-48 bg-white/10 rounded mb-2 animate-pulse" />
  
          <div className="h-12 w-full bg-white/90 rounded-2xl animate-pulse" />
  
          <div className="flex flex-col gap-2.5 mt-5">
            <div className="h-14 w-full bg-[#F8C927]/30 rounded-2xl animate-pulse" />
            <div className="h-12 w-full bg-white/10 rounded-2xl animate-pulse" />
          </div>
  
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-[#F8C927]/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
  
        {/* Featured skeleton */}
        <section className="mt-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2.5 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-7 w-20 bg-[#F8C927]/40 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3 px-5 pb-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shrink-0 w-[152px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-[112px] bg-gray-200 animate-pulse" />
                <div className="p-2.5 space-y-1.5">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-6 w-full bg-[#0F1120]/20 rounded-xl mt-2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
  
        {/* All professionals skeleton */}
        <section className="mt-5 px-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-200 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2.5 w-40 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2.5 w-12 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
  
        <div className="h-32" />
      </>
    );
  }