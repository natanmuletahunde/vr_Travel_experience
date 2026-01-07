import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function AudioPlayer({ audioUrl, isPlaying, onPlayPause, isMuted, onToggleMute }) {
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  }, [])

  const handleSeek = (e) => {
    const audio = audioRef.current
    const newTime = e.target.value
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!audioUrl) return null

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 glass-dark rounded-2xl p-6 min-w-[320px]">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onPlayPause}
            className="p-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #00f5ff 0%, #00f5ff ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
              }}
            />
            <span className="text-xs text-gray-400 w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #00f5ff, #b347ff);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(179, 71, 255, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #00f5ff, #b347ff);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(179, 71, 255, 0.5);
        }
      `}</style>
    </div>
  )
}