import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = supabase.auth

export const destinationsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  
  async getById(id) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  async create(destination) {
    const { data, error } = await supabase
      .from('destinations')
      .insert([destination])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

export const favoritesAPI = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        destinations (
          id,
          name,
          country,
          panorama_url
        )
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },
  
  async add(userId, destinationId) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        destination_id: destinationId
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  async remove(userId, destinationId) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
    
    if (error) throw error
  }
}