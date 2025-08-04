'use client'

import { useState } from 'react'
import { X, Crown, Star, Gem, Zap } from 'lucide-react'
import { TIER_LABELS } from '@/lib/types'
import type { TierLevel } from '@/lib/types'

interface TierUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentTier: TierLevel
  onUpgrade: (newTier: TierLevel) => void
}

const TIER_BENEFITS: Record<Exclude<TierLevel, 'free'>, {
  icon: React.ComponentType<any>
  price: string
  benefits: string[]
}> = {
  silver: {
    icon: Star,
    price: '$9.99/month',
    benefits: ['Access to Silver tier events', 'Priority support', 'Monthly newsletters']
  },
  gold: {
    icon: Crown,
    price: '$19.99/month',
    benefits: ['Access to Gold tier events', 'VIP support', 'Exclusive content', 'Early access']
  },
  platinum: {
    icon: Gem,
    price: '$39.99/month',
    benefits: ['Access to all events', 'Personal account manager', 'Custom experiences', 'Direct CEO access']
  }
}

export function TierUpgradeModal({ isOpen, onClose, currentTier, onUpgrade }: TierUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<TierLevel | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)

  if (!isOpen) return null

  const availableTiers = Object.keys(TIER_BENEFITS).filter(
    tier => {
      const tierOrder = { free: 0, silver: 1, gold: 2, platinum: 3 }
      return tierOrder[tier as TierLevel] > tierOrder[currentTier]
    }
  ) as TierLevel[]

  const handleUpgrade = async () => {
    if (!selectedTier) return
    
    setIsUpgrading(true)
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 2000))
    onUpgrade(selectedTier)
    setIsUpgrading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Tier</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Unlock exclusive events and premium features
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {availableTiers.map((tier) => {
              const tierBenefits = TIER_BENEFITS[tier as keyof typeof TIER_BENEFITS]
              const TierIcon = tierBenefits.icon
              const isSelected = selectedTier === tier
              
              return (
                <div
                  key={tier}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTier(tier)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      tier === 'silver' ? 'bg-gray-100' :
                      tier === 'gold' ? 'bg-amber-100' :
                      'bg-purple-100'
                    }`}>
                      <TierIcon className={`w-6 h-6 ${
                        tier === 'silver' ? 'text-gray-600' :
                        tier === 'gold' ? 'text-amber-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {TIER_LABELS[tier]} Tier
                        </h3>
                        <span className="text-lg font-bold text-gray-900">
                          {tierBenefits.price}
                        </span>
                      </div>
                      
                      <ul className="space-y-1">
                        {tierBenefits.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <Zap className="w-3 h-3 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!selectedTier || isUpgrading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpgrading ? 'Upgrading...' : `Upgrade to ${selectedTier ? TIER_LABELS[selectedTier] : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}