import React, { useState, useEffect } from 'react'
import { destinationsAPI } from '../services/supabaseClient'
import DestinationCard from '../components/DestinationCard'
import Loader from '../components/Loader'
import { Search, Filter } from 'lucide-react'

export default function Explore() {
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')

  useEffect(() => {
    loadDestinations()
  }, [])

  useEffect(() => {
    filterDestinations()
  }, [destinations, searchTerm, selectedCountry])

  const loadDestinations = async () => {
    try {
      setLoading(true)
      const data = await destinationsAPI.getAll()
      setDestinations(data)
    } catch (error) {
      console.error('Error loading destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDestinations = () => {
    let filtered = destinations

    if (searchTerm) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(dest => dest.country === selectedCountry)
    }

    setFilteredDestinations(filtered)
  }

  const countries = [...new Set(destinations.map(dest => dest.country))]

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
            Explore Destinations
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover amazing places around the world through immersive 360° experiences
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations, countries, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCountry === 'all'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'glass text-gray-300 hover:bg-white/20'
              }`}
            >
              All Countries
            </button>
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCountry === country
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                    : 'glass text-gray-300 hover:bg-white/20'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-400">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
          </p>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDestinations.map(destination => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 p-4 glass rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No destinations found</h3>
            <p className="text-gray-400 mb-8">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCountry('all')
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}