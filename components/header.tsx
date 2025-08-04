'use client'

import { useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { TIER_LABELS, TIER_COLORS } from '@/lib/types'
import type { TierLevel } from '@/lib/types'

interface HeaderProps {
  userTier?: TierLevel
  onTierUpgrade: () => void
}

export function Header({ userTier, onTierUpgrade }: HeaderProps) {
  const { isSignedIn } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Main header row */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo - responsive sizing */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tier Events
            </h1>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn && userTier && (
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${TIER_COLORS[userTier]}`}>
                  {TIER_LABELS[userTier]} Member
                </span>
                {userTier !== 'platinum' && (
                  <button
                    onClick={onTierUpgrade}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap"
                  >
                    Upgrade Tier
                  </button>
                )}
              </div>
            )}
            
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            ) : (
              <div className="flex space-x-2">
                <a
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isSignedIn && (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7"
                  }
                }}
              />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-3">
              {isSignedIn && userTier && (
                <>
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium border ${TIER_COLORS[userTier]} w-fit`}>
                      {TIER_LABELS[userTier]} Member
                    </span>
                    {userTier !== 'platinum' && (
                      <button
                        onClick={() => {
                          onTierUpgrade()
                          setIsMobileMenuOpen(false)
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors text-left w-fit"
                      >
                        Upgrade Tier
                      </button>
                    )}
                  </div>
                </>
              )}
              
              {!isSignedIn && (
                <div className="flex flex-col space-y-2">
                  <a
                    href="/sign-in"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/sign-up"
                    className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}