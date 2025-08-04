'use client'

import { format } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'
import { TIER_COLORS, TIER_LABELS } from '@/lib/types'
import type { Event } from '@/lib/types'

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className = '' }: EventCardProps) {
  return (
    <div className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${className}`}>
      <div className="relative overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-1 text-xs font-medium border ${TIER_COLORS[event.tier]}`}>
            {TIER_LABELS[event.tier]}
          </span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}