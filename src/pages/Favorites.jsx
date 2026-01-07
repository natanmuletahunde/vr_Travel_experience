import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { favoritesAPI } from '../services/supabaseClient'
import DestinationCard from '../components/DestinationCard'
import Loader from '../components/Loader'
import { Heart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const data = await favoritesAPI.getByUser(user.id)
      setFavorites(data)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (destinationId) => {
    try {
      await favoritesAPI.remove(user.id, destinationId)
      setFavorites(favorites.filter(fav => fav.destination_id !== destinationId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 p-4 glass rounded-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-300 mb-8 max-w-md">
            Please sign in to view and manage your favorite destinations
          </p>
          <Link to="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
            My Favorites
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your personally curated collection of amazing destinations
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span className="text-white">
                  {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
                </span>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map(favorite => (
                <DestinationCard
                  key={favorite.id}
                  destination={favorite.destinations}
                  isFavorite={true}
                  onToggleFavorite={() => handleRemoveFavorite(favorite.destination_id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 p-4 glass rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No favorites yet</h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Start exploring and save your favorite destinations to build your personal collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore" className="btn-primary">
                Explore Destinations
              </Link>
              <Link to="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}