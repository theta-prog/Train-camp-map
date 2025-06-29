'use client'

import { Campsite } from '@/types/campsite'
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import { useCallback, useState } from 'react'

interface MapAddComponentProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation: { lat: number; lng: number } | null
  existingCampsites: Campsite[]
}

const center = {
  lat: 36.2,
  lng: 139.3
}

export default function MapAddComponent({ 
  onLocationSelect, 
  selectedLocation, 
  existingCampsites 
}: MapAddComponentProps) {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)

  const handleMapClick = useCallback((event: any) => {
    if (event.detail?.latLng) {
      const lat = event.detail.latLng.lat
      const lng = event.detail.latLng.lng
      onLocationSelect(lat, lng)
    }
  }, [onLocationSelect])

  // 現在位置を取得する関数
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationSelect(latitude, longitude)
          
          // 地図の中心を現在位置に移動
          if (mapInstance) {
            mapInstance.setCenter({ lat: latitude, lng: longitude })
            mapInstance.setZoom(15)
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
          alert('位置情報の取得に失敗しました。手動で地図上をクリックしてください。')
        }
      )
    } else {
      alert('このブラウザは位置情報に対応していません。')
    }
  }, [onLocationSelect, mapInstance])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">位置を選択</h3>
          <p className="text-sm text-gray-600">
            地図をクリックしてキャンプ場の位置を指定してください
          </p>
        </div>
        <button
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          現在位置を取得
        </button>
      </div>

      <div style={{ width: '100%', height: '500px' }}>
        <Map
          defaultCenter={center}
          defaultZoom={8}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || null}
          style={{ width: '100%', height: '100%' }}
          onClick={handleMapClick}
          onIdle={(map) => setMapInstance(map.map)}
        >
          {/* 既存のキャンプ場 */}
          {existingCampsites
            .filter(campsite => campsite.lat != null && campsite.lng != null)
            .map((campsite) => (
            <AdvancedMarker
              key={campsite.id}
              position={{ lat: campsite.lat!, lng: campsite.lng! }}
              title={campsite.name.ja}
            >
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#6b7280',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                🏕
              </div>
            </AdvancedMarker>
          ))}

          {/* 選択された位置 */}
          {selectedLocation && (
            <AdvancedMarker
              position={selectedLocation}
              title="新しいキャンプ場"
            >
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                border: '3px solid white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                animation: 'pulse 2s infinite'
              }}>
                📍
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </div>

      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">位置が選択されました</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>緯度: {selectedLocation.lat.toFixed(6)}</p>
                <p>経度: {selectedLocation.lng.toFixed(6)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
