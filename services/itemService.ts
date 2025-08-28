import { createClient } from '@/lib/supabase/client'
import { Item, ItemInsert, ItemUpdate, ItemStatus } from '@/types/models'

export class ItemService {
  private supabase = createClient()

  async getItems(userId: string): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getItem(id: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  async createItem(item: ItemInsert): Promise<Item> {
    const { data, error } = await this.supabase
      .from('items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateItem(id: string, updates: ItemUpdate): Promise<Item> {
    const { data, error } = await this.supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async updateItemStatus(id: string, status: ItemStatus): Promise<Item> {
    return this.updateItem(id, { status })
  }

  async getItemsByStatus(userId: string, status: ItemStatus): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async searchItems(userId: string, query: string): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async archiveItem(id: string): Promise<Item> {
    return this.updateItemStatus(id, 'archived')
  }

  async bulkUpdateStatus(ids: string[], status: ItemStatus): Promise<void> {
    const { error } = await this.supabase
      .from('items')
      .update({ status })
      .in('id', ids)

    if (error) throw error
  }

  subscribeToChanges(
    userId: string,
    callback: (payload: any) => void
  ) {
    return this.supabase
      .channel('items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  }
}