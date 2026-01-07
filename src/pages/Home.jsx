import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, MapPin, Play, Star, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="mb-8 animate-float">
            <div className="w-32 h-32 mx-auto mb-8 p-4 neon-border rounded-full flex items-center justify-center">
              <Compass className="w-24 h-24 text-neon-blue" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-glow">
            VR Travel
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the world's most breathtaking destinations from the comfort of your home. 
            Immerse yourself in 360° panoramic views and explore famous landmarks like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/explore" className="btn-primary text-lg px-8 py-4 flex items-center gap-3">
              <Globe className="w-6 h-6" />
              Explore Destinations
            </Link>
            
            <Link to="/demo" className="btn-secondary text-lg px-8 py-4 flex items-center gap-3">
              <Play className="w-6 h-6" />
              Try Demo
            </Link>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Why Choose VR Travel?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-glow text-center">
              <div className="w-20 h-20 mx-auto mb-6 p-4 glass rounded-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-neon-blue" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">360° Exploration</h3>
              <p className="text-gray-300">
                Navigate freely in stunning panoramic environments with smooth, intuitive controls
              </p>
            </div>
            
            <div className="card-glow text-center">
              <div className="w-20 h-20 mx-auto mb-6 p-4 glass rounded-full flex items-center justify-center">
                <Star className="w-12 h-12 text-neon-purple" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Premium Destinations</h3>
              <p className="text-gray-300">
                Curated collection of world-famous landmarks and hidden gems
              </p>
            </div>
            
            <div className="card-glow text-center">
              <div className="w-20 h-20 mx-auto mb-6 p-4 glass rounded-full flex items-center justify-center">
                <Play className="w-12 h-12 text-neon-pink" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Audio Narrations</h3>
              <p className="text-gray-300">
                Learn about each destination with immersive audio guides and historical context
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Popular Destinations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Eiffel Tower', country: 'Paris, France', emoji: '🗼' },
              { name: 'Great Wall', country: 'Beijing, China', emoji: '🏯' },
              { name: 'Colosseum', country: 'Rome, Italy', emoji: '🏛️' },
              { name: 'Taj Mahal', country: 'Agra, India', emoji: '🕌' },
              { name: 'Statue of Liberty', country: 'New York, USA', emoji: '🗽' },
              { name: 'Machu Picchu', country: 'Peru', emoji: '⛰️' }
            ].map((dest, index) => (
              <div key={index} className="card-glow cursor-pointer hover:scale-105 transition-transform">
                <div className="h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">{dest.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{dest.name}</h3>
                <p className="text-gray-400">{dest.country}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/explore" className="btn-primary text-lg px-8 py-4">
              Explore All Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}