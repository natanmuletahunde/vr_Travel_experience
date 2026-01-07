import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Viewer from './pages/Viewer'
import Favorites from './pages/Favorites'
import Auth from './pages/Auth'
import { destinationsAPI } from './services/supabaseClient'

// Sample data for demo purposes (since we don't have real panoramic images)
const sampleDestinations = [
  {
    id: '1',
    name: 'Eiffel Tower',
    country: 'Paris, France',
    description: 'The iconic iron lattice tower on the Champ de Mars, originally built as entrance arch for the 1889 World\'s Fair. At 324 meters tall, it stands as one of the most recognizable structures in the world.',
    panorama_url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="2048" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFE4B5;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="ground" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#90EE90;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="2048" height="1024" fill="url(#sky)"/>
        <rect y="600" width="2048" height="424" fill="url(#ground)"/>
        <text x="1024" y="512" text-anchor="middle" font-size="48" fill="#333">Eiffel Tower - Paris</text>
        <circle cx="300" cy="300" r="50" fill="#FFD700"/>
        <circle cx="1748" cy="300" r="50" fill="#FFD700"/>
      </svg>
    `),
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    name: 'Great Wall of China',
    country: 'Beijing, China',
    description: 'An ancient fortification system stretching across northern China, the Great Wall is one of the most impressive architectural feats in human history.',
    panorama_url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="2048" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FFB6C1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFA07A;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="2048" height="1024" fill="url(#sky)"/>
        <rect y="700" width="2048" height="324" fill="#8B7355"/>
        <text x="1024" y="512" text-anchor="middle" font-size="48" fill="#333">Great Wall of China</text>
        <rect x="100" y="500" width="200" height="200" fill="#8B4513"/>
        <rect x="500" y="450" width="200" height="250" fill="#8B4513"/>
        <rect x="900" y="500" width="200" height="200" fill="#8B4513"/>
      </svg>
    `),
    audio_url: null
  },
  {
    id: '3',
    name: 'Colosseum',
    country: 'Rome, Italy',
    description: 'The largest amphitheater ever built, the Colosseum is an iconic symbol of Imperial Rome and architectural engineering.',
    panorama_url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="2048" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEFA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F0E68C;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="2048" height="1024" fill="url(#sky)"/>
        <rect y="650" width="2048" height="374" fill="#DEB887"/>
        <ellipse cx="1024" cy="600" rx="300" ry="150" fill="#CD853F"/>
        <ellipse cx="1024" cy="600" rx="200" ry="100" fill="#8B4513"/>
        <text x="1024" y="450" text-anchor="middle" font-size="48" fill="#333">Colosseum - Rome</text>
      </svg>
    `),
    audio_url: null
  }
]

// Mock the destinationsAPI for demo purposes
destinationsAPI.getAll = async () => sampleDestinations
destinationsAPI.getById = async (id) => sampleDestinations.find(d => d.id === id) || null

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/viewer/:id" element={<Viewer />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  )
}