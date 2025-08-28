import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Item = Database['public']['Tables']['items']['Row']
export type ItemInsert = Database['public']['Tables']['items']['Insert']
export type ItemUpdate = Database['public']['Tables']['items']['Update']

export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type ItemStatus = Database['public']['Enums']['item_status']

export interface UserProfile extends Profile {
  items?: Item[]
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}