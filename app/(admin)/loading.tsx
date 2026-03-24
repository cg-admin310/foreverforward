export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[#FBF6E9] rounded-lg shimmer" />
          <div className="h-4 w-64 bg-[#DDDDDD] rounded" />
        </div>
        <div className="h-10 w-32 bg-[#FBF6E9] rounded-lg shimmer" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-20 bg-[#DDDDDD] rounded" />
                <div className="h-7 w-16 bg-[#FBF6E9] rounded shimmer" />
              </div>
              <div className="w-10 h-10 bg-[#FBF6E9] rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-[#FAFAF8] rounded-lg" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-[#FAFAF8] rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#FAFAF8] border-b border-[#DDDDDD] px-4 py-3 flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-24 bg-[#DDDDDD] rounded" />
          ))}
        </div>

        {/* Table Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-4 py-4 border-b border-[#DDDDDD] flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FBF6E9] rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-[#FBF6E9] rounded shimmer" />
              <div className="h-3 w-28 bg-[#DDDDDD] rounded" />
            </div>
            <div className="h-6 w-20 bg-[#EFF4EB] rounded-full" />
            <div className="h-4 w-24 bg-[#DDDDDD] rounded" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[#FAFAF8] rounded-lg" />
              <div className="w-8 h-8 bg-[#FAFAF8] rounded-lg" />
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#DDDDDD] flex items-center justify-between">
          <div className="h-4 w-32 bg-[#DDDDDD] rounded" />
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-[#FAFAF8] rounded" />
            <div className="w-8 h-8 bg-[#FBF6E9] rounded shimmer" />
            <div className="w-8 h-8 bg-[#FAFAF8] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
