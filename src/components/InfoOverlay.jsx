import React from 'react'
import { X, Volume2, VolumeX } from 'lucide-react'

export default function InfoOverlay({ destination, isVisible, onClose, isAudioPlaying, onToggleAudio }) {
  if (!isVisible || !destination) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-float">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 glass rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              {destination.name}
            </h2>
            <p className="text-gray-400 mt-2">{destination.country}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">About this place</h3>
              <p className="text-gray-300 leading-relaxed">{destination.description}</p>
            </div>

            {destination.audio_url && (
              <div className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-neon-blue" />
                  <span className="text-gray-300">Audio narration available</span>
                </div>
                <button
                  onClick={onToggleAudio}
                  className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
                >
                  {isAudioPlaying ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}