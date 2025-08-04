import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function getCurrentUserProfile() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = createClient()
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error)
    return null
  }
}

export async function ensureUserProfile() {
  try {
    const user = await currentUser()
    if (!user) return null

    const supabase = createClient()
    
    // Try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return existingProfile
    }

    // Create new profile if it doesn't exist
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: user.id,
          tier: 'free'
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user profile:', insertError)
      return null
    }

    return newProfile
  } catch (error) {
    console.error('Error in ensureUserProfile:', error)
    return null
  }
}