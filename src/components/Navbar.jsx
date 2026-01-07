import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 w-full z-50 glass-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            VR Travel
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') ? 'text-neon-blue' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`transition-colors ${
                isActive('/explore') ? 'text-neon-blue' : 'text-gray-300 hover:text-white'
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link
                to="/favorites"
                className={`transition-colors ${
                  isActive('/favorites') ? 'text-neon-blue' : 'text-gray-300 hover:text-white'
                }`}
              >
                Favorites
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300">{user.email}</span>
                <button
                  onClick={signOut}
                  className="btn-secondary text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link to="/auth" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}