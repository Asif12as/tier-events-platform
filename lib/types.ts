export type TierLevel = 'free' | 'silver' | 'gold' | 'platinum'

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  image_url: string
  tier: TierLevel
  created_at: string
}

export interface UserProfile {
  id: string
  tier: TierLevel
  created_at: string
  updated_at: string
}

export const TIER_COLORS = {
  free: 'bg-gray-100 text-gray-800 border-gray-200',
  silver: 'bg-gray-200 text-gray-900 border-gray-300',
  gold: 'bg-amber-100 text-amber-800 border-amber-200',
  platinum: 'bg-purple-100 text-purple-800 border-purple-200'
} as const

export const TIER_LABELS = {
  free: 'Free',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum'
} as const

export const TIER_HIERARCHY: Record<TierLevel, TierLevel[]> = {
  free: ['free'],
  silver: ['free', 'silver'],
  gold: ['free', 'silver', 'gold'],
  platinum: ['free', 'silver', 'gold', 'platinum']
}