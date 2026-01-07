import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { VRControls } from './Controls'

export default function VRScene({ panoramaUrl, onLoadingChange }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const frameRef = useRef(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!mountRef.current || !panoramaUrl) return

    const width = window.innerWidth
    const height = window.innerHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 0.1)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 1)
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Create panoramic sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // Flip geometry to see texture from inside

    const textureLoader = new THREE.TextureLoader()
    
    textureLoader.load(
      panoramaUrl,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        })

        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        setIsLoaded(true)
        setError(null)
        if (onLoadingChange) onLoadingChange(false)
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100
        console.log(`Loading progress: ${percent}%`)
      },
      (error) => {
        console.error('Error loading panorama:', error)
        setError('Failed to load panoramic image')
        setIsLoaded(false)
        if (onLoadingChange) onLoadingChange(false)
      }
    )

    // Controls setup
    const controls = new VRControls(camera, renderer.domElement)
    controlsRef.current = controls

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      
      window.removeEventListener('resize', handleResize)
    }
  }, [panoramaUrl, onLoadingChange])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <p className="text-gray-400">Please check the panoramic image URL and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-neon-blue border-r-neon-purple border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading VR Environment...</p>
          </div>
        </div>
      )}
    </div>
  )
}