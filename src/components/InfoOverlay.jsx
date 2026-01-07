import React, { useState, useRef, useEffect } from 'react'
import { X, Volume2, VolumeX, Play, Pause, Maximize2, RotateCw } from 'lucide-react'
import * as THREE from 'three'

export default function InfoOverlay({ destination, isVisible, onClose, isAudioPlaying, onToggleAudio }) {
  const [isLocalAudioPlaying, setIsLocalAudioPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const audioRef = useRef(null)
  const panoramaRef = useRef(null)
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const sphereRef = useRef(null)

  // Initialize 360 panorama view
  useEffect(() => {
    if (!isVisible || !mountRef.current || !destination) return

    console.log('Initializing InfoOverlay panorama for:', destination.name)

    const width = mountRef.current.clientWidth || 800
    const height = mountRef.current.clientHeight || 400

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 0.1)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 1)
    rendererRef.current = renderer

    // Clear previous content
    mountRef.current.innerHTML = ''
    mountRef.current.appendChild(renderer.domElement)

    // Create panoramic sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // Flip to see from inside

    // Always create fallback texture first to ensure something displays
    const createFallbackTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 2048
      canvas.height = 1024
      const ctx = canvas.getContext('2d')
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1024)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(1, '#FFE4B5')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add some decorative elements
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(300, 300, 50, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(1748, 300, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Add text
      ctx.fillStyle = '#333'
      ctx.font = '48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(destination.name, 1024, 512)
      
      return new THREE.CanvasTexture(canvas)
    }

    // Create initial material with fallback
    const fallbackTexture = createFallbackTexture()
    const material = new THREE.MeshBasicMaterial({
      map: fallbackTexture,
      side: THREE.DoubleSide
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphereRef.current = sphere
    scene.add(sphere)

    // Try to load real panorama
    const textureLoader = new THREE.TextureLoader()
    if (destination.panorama_url && !destination.panorama_url.includes('data:image/svg+xml')) {
      textureLoader.load(
        destination.panorama_url,
        (texture) => {
          console.log('Successfully loaded panorama texture')
          const newMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          })
          sphere.material = newMaterial
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%')
        },
        (error) => {
          console.warn('Error loading panorama, using fallback:', error)
        }
      )
    }

    // Auto-rotation
    const animate = () => {
      requestAnimationFrame(animate)
      if (sphereRef.current && !isFullscreen) {
        sphereRef.current.rotation.y += 0.002
      }
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isVisible, destination, isFullscreen])

  // Handle audio
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

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isLocalAudioPlaying) {
        audio.pause()
        setIsLocalAudioPlaying(false)
      } else {
        await audio.play()
        setIsLocalAudioPlaying(true)
      }
      onToggleAudio()
    } catch (error) {
      console.error('Audio play error:', error)
      // Still toggle the state even if play fails
      setIsLocalAudioPlaying(!isLocalAudioPlaying)
      onToggleAudio()
    }
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = e.target.value
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleRotate = () => {
    if (sphereRef.current) {
      setRotation(rotation + 90)
      sphereRef.current.rotation.y += (Math.PI / 2)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!isVisible || !destination) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[9999] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`relative glass-dark rounded-2xl overflow-hidden pointer-events-auto transform transition-all duration-300 ${
            isFullscreen ? 'w-full h-full max-w-none max-h-none rounded-none' : 'w-full max-w-6xl h-[80vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-3 glass-dark rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close info overlay"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* 360 Panorama View */}
          <div className="relative w-full h-full">
            <div 
              ref={mountRef} 
              className="w-full h-full"
              style={{ height: isFullscreen ? '100vh' : '60vh' }}
            />

            {/* Panorama Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="glass-dark rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                    <p className="text-gray-300 text-sm">{destination.country}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRotate}
                      className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
                      title="Rotate view"
                    >
                      <RotateCw className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
                      title="Toggle fullscreen"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {destination.description}
                  </p>
                </div>

                {/* Audio Controls */}
                {destination.audio_url && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-neon-blue" />
                        <span className="text-gray-300 text-sm">Audio Guide</span>
                      </div>
                      <button
                        onClick={handlePlayPause}
                        className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
                      >
                        {isLocalAudioPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 w-10">
                        {formatTime(currentTime)}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #00f5ff 0%, #00f5ff ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                        }}
                      />
                      <span className="text-xs text-gray-400 w-10">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Experience Info */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="glass rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-xs">Experience</p>
                    <p className="text-white font-semibold text-sm">360° VR</p>
                  </div>
                  <div className="glass rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-xs">Audio Guide</p>
                    <p className="text-white font-semibold text-sm">
                      {destination.audio_url ? 'Available' : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Audio Element */}
          {destination.audio_url && (
            <audio ref={audioRef} src={destination.audio_url} />
          )}
        </div>
      </div>
    </>
  )
}