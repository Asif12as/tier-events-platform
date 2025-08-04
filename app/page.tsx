'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/header'
import { EventsGrid } from '@/components/events-grid'
import { TierUpgradeModal } from '@/components/tier-upgrade-modal'
import { createClient } from '@/lib/supabase/client'
import { TIER_LABELS } from '@/lib/types'
import type { TierLevel, UserProfile } from '@/lib/types'

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchOrCreateUserProfile()
    }
  }, [isLoaded, isSignedIn, user])

  const fetchOrCreateUserProfile = async () => {
    if (!user) return

    try {
      const supabase = createClient()
      
      console.log('Fetching profile for user:', user.id)
      
      // Try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile)
        setUserProfile(existingProfile)
        return
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', fetchError)
        return
      }

      console.log('No profile found, creating new profile for user:', user.id)
      
      // Create new profile with user details from Clerk
      const profileData = {
        id: user.id,
        tier: 'free' as TierLevel,
        email: user.primaryEmailAddress?.emailAddress || null,
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        image_url: user.imageUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('Creating profile with data:', profileData)
      
      // Create new profile if it doesn't exist
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user profile:', insertError)
        // Try alternative approach with upsert
        const { data: upsertProfile, error: upsertError } = await supabase
          .from('user_profiles')
          .upsert(profileData)
          .select()
          .single()
        
        if (upsertError) {
          console.error('Error upserting user profile:', upsertError)
          return
        }
        
        console.log('Successfully created profile via upsert:', upsertProfile)
        setUserProfile(upsertProfile)
        return
      }

      console.log('Successfully created new profile:', newProfile)
      setUserProfile(newProfile)
    } catch (error) {
      console.error('Error handling user profile:', error)
    }
  }

  const handleTierUpgrade = async (newTier: TierLevel) => {
    if (!user || !userProfile) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_profiles')
        .update({ tier: newTier, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) {
        console.error('Error upgrading tier:', error)
        return
      }

      setUserProfile({ ...userProfile, tier: newTier })
      setRefreshTrigger(prev => prev + 1)
      
      // Show success message
      alert(`🎉 Congratulations! You've been upgraded to ${TIER_LABELS[newTier]} tier!`)
    } catch (error) {
      console.error('Error upgrading tier:', error)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        userTier={userProfile?.tier}
        onTierUpgrade={() => setIsUpgradeModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight px-2">
            Exclusive Events Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            {isSignedIn 
              ? `Welcome back! Explore events available for your ${userProfile?.tier ? TIER_LABELS[userProfile.tier] : 'Free'} membership.`
              : 'Join our community to access exclusive events tailored to your membership tier.'
            }
          </p>
          
          {!isSignedIn && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <a
                href="/sign-up"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Join Now - It's Free!
              </a>
              <a
                href="/sign-in"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        <EventsGrid 
          userTier={userProfile?.tier} 
          refreshTrigger={refreshTrigger}
        />
      </main>

      {userProfile && (
        <TierUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          currentTier={userProfile.tier}
          onUpgrade={handleTierUpgrade}
        />
      )}
    </div>
  )
}