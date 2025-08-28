import { createClient } from '@/lib/supabase/client'
import { Profile, ProfileUpdate, SubscriptionStatus } from '@/types/models'

export class ProfileService {
  private supabase = createClient()

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateSubscriptionStatus(
    userId: string,
    status: SubscriptionStatus
  ): Promise<Profile> {
    return this.updateProfile(userId, {
      subscription_status: status,
      is_paid: status === 'paid',
    })
  }

  async getProfileWithItems(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        items (*)
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async checkSubscriptionStatus(userId: string): Promise<{
    isPaid: boolean
    status: SubscriptionStatus
  }> {
    const profile = await this.getProfile(userId)
    if (!profile) {
      return { isPaid: false, status: 'free' }
    }
    return {
      isPaid: profile.is_paid,
      status: profile.subscription_status as SubscriptionStatus,
    }
  }

  subscribeToProfileChanges(
    userId: string,
    callback: (payload: any) => void
  ) {
    return this.supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  }
}