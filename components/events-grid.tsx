'use client'

import { useState, useEffect, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { EventCard } from './event-card'
import { EventGridSkeleton } from './loading-skeleton'
import { AlertCircle } from 'lucide-react'
import { TIER_HIERARCHY } from '@/lib/types'
import type { Event, TierLevel } from '@/lib/types'

interface EventsGridProps {
  userTier?: TierLevel
  refreshTrigger?: number
}

export function EventsGrid({ userTier, refreshTrigger }: EventsGridProps) {
  const { user } = useUser()
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [refreshTrigger])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setAllEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter events based on user tier
  const filteredEvents = useMemo(() => {
    if (!user) {
      // Show only free events for non-authenticated users
      return allEvents.filter(event => event.tier === 'free')
    }

    if (!userTier) {
      // Default to free tier if no tier is set
      return allEvents.filter(event => event.tier === 'free')
    }

    const allowedTiers = TIER_HIERARCHY[userTier] || ['free']
    return allEvents.filter(event => allowedTiers.includes(event.tier))
  }, [allEvents, userTier, user])

  if (isLoading) {
    return <EventGridSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load events
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No events available
        </h3>
        <p className="text-gray-600">
          {userTier ? `Check back later for new events in your ${userTier} tier.` : 'Sign in to view exclusive events.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}