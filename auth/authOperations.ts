import { createClient } from '@/lib/supabase/client'
import { AuthError } from '@supabase/supabase-js'

const supabase = createClient()

export const authOperations = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    })
    
    if (error) throw error
    
    // Create user profile in the database
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          display_name: displayName || email.split('@')[0],
          is_paid: false,
          subscription_status: 'free',
        })
      
      if (profileError) console.error('Error creating profile:', profileError)
    }
    
    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) throw error
    return data
  },

  signInAnonymously: async () => {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    return data
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) throw error
  },

  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) throw error
  },

  updateProfile: async (displayName: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('No user found')
    
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id)
    
    if (error) throw error
  },

  sendEmailVerification: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) throw new Error('No email found')
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    })
    
    if (error) throw error
  },

  deleteAccount: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('No user found')
    
    // Delete user profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)
    
    if (profileError) throw profileError
    
    // Note: Actual account deletion requires server-side admin privileges
    // This would typically be handled by an API route or Edge Function
    throw new Error('Account deletion requires server-side implementation')
  },
}