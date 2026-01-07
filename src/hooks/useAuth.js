import { useState, useEffect } from 'react'
import { auth, favoritesAPI } from '../services/supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const { data, error } = await auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  const toggleFavorite = async (destinationId) => {
    if (!user) return { error: { message: 'User not authenticated' } }
    
    try {
      // Check if already favorited
      const favorites = await favoritesAPI.getByUser(user.id)
      const isFavorited = favorites.some(fav => fav.destination_id === destinationId)
      
      if (isFavorited) {
        // Remove from favorites
        await favoritesAPI.remove(user.id, destinationId)
        return { data: { favorited: false }, error: null }
      } else {
        // Add to favorites
        await favoritesAPI.add(user.id, destinationId)
        return { data: { favorited: true }, error: null }
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  const checkFavorite = async (destinationId) => {
    if (!user) return false
    
    try {
      const favorites = await favoritesAPI.getByUser(user.id)
      return favorites.some(fav => fav.destination_id === destinationId)
    } catch (error) {
      console.error('Error checking favorite:', error)
      return false
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    toggleFavorite,
    checkFavorite,
  }
}