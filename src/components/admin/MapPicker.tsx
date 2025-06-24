'use client'

import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { useCallback, useEffect, useState } from 'react'

interface MapPickerProps {
  lat?: number
  lng?: number
  onLocationSelect: (lat: number, lng: number) => void
  className?: string
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const listener = map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onLocationSelect(lat, lng)
      }
    })

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [map, onLocationSelect])

  return null
}

export default function MapPicker({
  lat = 35.6762,
  lng = 139.6503,
  onLocationSelect,
  className = ""
}: MapPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState({
    lat,
    lng
  })

  // 初期値が変更された場合に状態を更新
  useEffect(() => {
    setSelectedPosition({ lat, lng })
  }, [lat, lng])

  const handleLocationUpdate = useCallback((newLat: number, newLng: number) => {
    setSelectedPosition({ lat: newLat, lng: newLng })
    onLocationSelect(newLat, newLng)
  }, [onLocationSelect])

  // APIキーが設定されていない場合のエラーハンドリング
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500 mb-2">Google Maps APIキーが設定されていません</p>
        <p className="text-sm text-gray-400">
          .env.localファイルにNEXT_PUBLIC_GOOGLE_MAPS_API_KEYを設定してください
        </p>
        <div className="mt-4 text-sm text-gray-600">
          <p>現在の位置: 緯度 {selectedPosition.lat.toFixed(6)}, 経度 {selectedPosition.lng.toFixed(6)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          地図をクリックして位置を選択してください
        </p>
        <p className="text-xs text-gray-500">
          選択位置: 緯度 {selectedPosition.lat.toFixed(6)}, 経度 {selectedPosition.lng.toFixed(6)}
        </p>
      </div>
      
      <div style={{ width: '100%', height: '400px' }} className="border rounded-lg overflow-hidden">
        <Map
          defaultCenter={selectedPosition}
          defaultZoom={12}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || null}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={true}
          gestureHandling={'greedy'}
        >
          <MapClickHandler onLocationSelect={handleLocationUpdate} />
          <AdvancedMarker
            position={selectedPosition}
            title="選択した位置"
          >
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }} />
          </AdvancedMarker>
        </Map>
      </div>
    </div>
  )
}
