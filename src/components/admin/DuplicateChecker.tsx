'use client'

import { CampsiteFormData } from '@/lib/validations/campsite'
import { useState } from 'react'

interface DuplicateCheckerProps {
  formData: Partial<CampsiteFormData>
  onDuplicateFound: (duplicates: any[]) => void
}

export default function DuplicateChecker({ formData, onDuplicateFound }: DuplicateCheckerProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const checkForDuplicates = async () => {
    if (!formData.name_ja && !formData.lat && !formData.lng) {
      return
    }

    setIsChecking(true)

    try {
      const response = await fetch('/api/campsites')
      const result = await response.json()

      if (response.ok && result.data) {
        const duplicates = result.data.filter((campsite: any) => {
          // 名前での重複チェック
          const nameMatch = formData.name_ja && 
            campsite.name?.ja?.toLowerCase().includes(formData.name_ja.toLowerCase())

          // 位置での重複チェック（100m以内）
          const locationMatch = formData.lat && formData.lng &&
            campsite.lat && campsite.lng &&
            getDistance(
              formData.lat, formData.lng,
              campsite.lat, campsite.lng
            ) < 0.1 // 100m以内

          return nameMatch || locationMatch
        })

        onDuplicateFound(duplicates)
        setLastChecked(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Duplicate check failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  // 2点間の距離を計算（km）
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const canCheck = formData.name_ja || (formData.lat && formData.lng)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">重複チェック</h3>
        <button
          onClick={checkForDuplicates}
          disabled={!canCheck || isChecking}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isChecking ? 'チェック中...' : 'チェック'}
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        名前や位置情報を入力してから重複チェックを実行してください
      </p>

      {lastChecked && (
        <p className="text-xs text-gray-500">
          最終チェック: {lastChecked}
        </p>
      )}

      {!canCheck && (
        <p className="text-xs text-orange-600">
          ⚠️ キャンプ場名または位置情報を入力してください
        </p>
      )}
    </div>
  )
}
