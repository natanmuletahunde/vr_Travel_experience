import React from 'react'

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-t-neon-blue border-r-neon-purple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-t-transparent border-r-transparent border-b-neon-pink border-l-transparent rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-r-neon-blue border-b-transparent border-l-neon-purple rounded-full animate-spin"></div>
        </div>
      </div>
      
      <div className="absolute bottom-32 text-center">
        <p className="text-xl font-semibold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent animate-pulse">
          Loading VR Experience
        </p>
        <p className="text-gray-400 mt-2">Preparing your virtual journey...</p>
      </div>
    </div>
  )
}