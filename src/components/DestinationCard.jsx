import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Play } from 'lucide-react'

export default function DestinationCard({ destination, isFavorite = false, onToggleFavorite }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(destination.id)
    }
  }

  return (
    <Link to={`/viewer/${destination.id}`}>
      <div
        className="card-glow cursor-pointer relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
          <img
            src={destination.panorama_url}
            alt={destination.name}
            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/80" />
            </div>
          )}

          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 p-2 glass rounded-full hover:bg-white/20 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{destination.name}</h3>
          <p className="text-gray-400 text-sm">{destination.country}</p>
          <p className="text-gray-300 line-clamp-2">{destination.description}</p>
        </div>
      </div>
    </Link>
  )
}