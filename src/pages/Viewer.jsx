import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { destinationsAPI } from '../services/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import VRScene from '../vr/VRScene'
import InfoOverlay from '../components/InfoOverlay'
import AudioPlayer from '../components/AudioPlayer'
import Loader from '../components/Loader'
import { Info, ArrowLeft, Heart, Volume2 } from 'lucide-react'

export default function Viewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, toggleFavorite, checkFavorite } = useAuth()
  
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    loadDestination()
  }, [id])

  useEffect(() => {
    if (destination && user) {
      checkIfFavorite()
    } else if (!user) {
      setIsFavorite(false)
    }
  }, [destination, user, id])

  const checkIfFavorite = async () => {
    if (user && destination) {
      const favorited = await checkFavorite(destination.id)
      setIsFavorite(favorited)
    }
  }

  const loadDestination = async () => {
    try {
      setLoading(true)
      const data = await destinationsAPI.getById(id)
      setDestination(data)
    } catch (error) {
      console.error('Error loading destination:', error)
      navigate('/explore')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = () => {
    setIsAudioPlaying(!isAudioPlaying)
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      // Redirect to auth page or show a message
      navigate('/auth')
      return
    }

    setFavoriteLoading(true)
    try {
      const { error } = await toggleFavorite(destination.id)
      if (error) {
        console.error('Error toggling favorite:', error)
      } else {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (!destination) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-white">Destination not found</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* VR Scene */}
      <VRScene 
        panoramaUrl={destination.panorama_url} 
        onLoadingChange={setLoading}
      />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/explore')}
              className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="glass px-4 py-2 rounded-lg">
              <h2 className="text-white font-semibold">{destination.name}</h2>
              <p className="text-gray-300 text-sm">{destination.country}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className="p-3 glass rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} ${favoriteLoading ? 'animate-pulse' : ''}`}
              />
            </button>
            
            <button
              onClick={() => setShowInfo(true)}
              className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
            >
              <Info className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="glass px-6 py-3 rounded-full">
          <p className="text-gray-300 text-sm">
            🖱️ Click and drag to explore • 📱 Touch and swipe on mobile • 🎯 Scroll to zoom • ⌨️ Arrow keys to navigate
          </p>
        </div>
      </div>

      {/* Info Button - Enhanced */}
      <div className="absolute top-24 left-6 z-40">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="px-4 py-3 glass-dark rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <Info className="w-5 h-5 text-white" />
          <span className="text-white font-medium">
            {showInfo ? 'Hide' : 'Show'} Details
          </span>
        </button>
      </div>

      {/* Info Overlay */}
      <InfoOverlay
        destination={destination}
        isVisible={showInfo}
        onClose={() => setShowInfo(false)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handlePlayPause}
      />

      {/* Audio Player */}
      {destination.audio_url && (
        <AudioPlayer
          audioUrl={destination.audio_url}
          isPlaying={isAudioPlaying}
          onPlayPause={handlePlayPause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  )
}