export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-6">
        <div className="h-5 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-1" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function EventGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}