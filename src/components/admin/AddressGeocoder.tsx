'use client'

import { useState } from 'react'

interface AddressGeocoderProps {
  onLocationFound: (lat: number, lng: number, address: string) => void
}

export default function AddressGeocoder({ onLocationFound }: AddressGeocoderProps) {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('住所を入力してください')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const geocoder = new google.maps.Geocoder()
      const result = await geocoder.geocode({ address })

      if (result.results && result.results.length > 0) {
        const firstResult = result.results[0]
        if (firstResult?.geometry?.location && firstResult?.formatted_address) {
          const location = firstResult.geometry.location
          const formattedAddress = firstResult.formatted_address
          
          onLocationFound(location.lat(), location.lng(), formattedAddress)
          setAddress('')
        } else {
          setError('位置情報の取得に失敗しました')
        }
      } else {
        setError('住所が見つかりませんでした')
      }
    } catch (err) {
      console.error('Geocoding error:', err)
      setError('住所の変換に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">住所から位置を検索</h3>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="例: 東京都八王子市高尾町"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onKeyPress={(e) => e.key === 'Enter' && handleGeocode()}
        />
        <button
          onClick={handleGeocode}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
