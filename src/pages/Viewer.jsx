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

  // Auto-show info overlay for demo
  useEffect(() => {
    if (!loading && destination && window.location.pathname === '/demo') {
      setShowInfo(true)
    }
  }, [loading, destination])

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
      
      // If no ID (demo route), use first destination
      const destinationId = id || '1'
      const data = await destinationsAPI.getById(destinationId)
      setDestination(data)
    } catch (error) {
      console.error('Error loading destination:', error)
      
      // For demo mode, create a fallback destination
      if (window.location.pathname === '/demo') {
        const fallbackDestination = {
          id: 'demo-1',
          name: 'Demo Destination',
          country: 'Virtual Reality',
          description: 'This is a demo destination showcasing the VR travel experience. Explore the panoramic view and test the audio controls.',
          panorama_url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="2048" height="1024" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#b347ff;stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="2048" height="1024" fill="url(#sky)"/>
              <text x="1024" y="512" text-anchor="middle" font-size="72" fill="#fff" font-weight="bold">VR Travel Demo</text>
              <text x="1024" y="580" text-anchor="middle" font-size="36" fill="#fff">360° Panoramic Experience</text>
              <circle cx="300" cy="300" r="80" fill="#FFD700" opacity="0.8"/>
              <circle cx="1748" cy="300" r="80" fill="#FF006E" opacity="0.8"/>
            </svg>
          `),
          audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }
        setDestination(fallbackDestination)
      } else {
        // Try to get all destinations and use the first one
        try {
          const allDestinations = await destinationsAPI.getAll()
          if (allDestinations.length > 0) {
            setDestination(allDestinations[0])
          } else {
            navigate('/explore')
          }
        } catch (fallbackError) {
          navigate('/explore')
        }
      }
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
          data-show-details="true"
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