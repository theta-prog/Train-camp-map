import { useCallback, useState } from 'react'
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { Campsite } from '@/types/campsite'

interface MapComponentProps {
  campsites: Campsite[]
  onCampsiteSelect: (campsite: Campsite | null) => void
  selectedCampsite: Campsite | null
}

const center = {
  lat: 36.2,
  lng: 139.3 // 関東地方全体が見えるように調整
}

export default function MapComponent({ 
  campsites, 
  onCampsiteSelect, 
  selectedCampsite 
}: MapComponentProps) {
  const t = useTranslations()
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as 'ja' | 'en') || 'ja'
  const [activeMarker, setActiveMarker] = useState<string | null>(null)

  const handleMarkerClick = useCallback((campsite: Campsite) => {
    setActiveMarker(campsite.id)
    onCampsiteSelect(campsite)
  }, [onCampsiteSelect])

  const handleInfoWindowClose = useCallback(() => {
    setActiveMarker(null)
  }, [])

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Map
        defaultCenter={center}
        defaultZoom={8}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || null}
        style={{ width: '100%', height: '100%' }}
        disableDefaultUI={false}
        zoomControl={true}
        gestureHandling={'greedy'}
      >
        {campsites.map((campsite) => (
          <AdvancedMarker
            key={campsite.id}
            position={{ lat: campsite.lat, lng: campsite.lng }}
            onClick={() => handleMarkerClick(campsite)}
            title={campsite.name[locale]}
          >
            <div style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              🏕
            </div>
          </AdvancedMarker>
        ))}

        {activeMarker && selectedCampsite && (
          <InfoWindow
            position={{ lat: selectedCampsite.lat, lng: selectedCampsite.lng }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-lg mb-1">{selectedCampsite.name[locale]}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedCampsite.address[locale]}</p>
              <p className="text-sm mb-1">
                <span className="font-semibold">{t('campsiteList.nearestStation')}:</span> {selectedCampsite.nearestStation[locale]}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">{t('campsiteList.access')}:</span> {selectedCampsite.accessTime[locale]}
              </p>
              <p className="text-sm mb-2">
                <span className="font-semibold">{t('campsiteList.price')}:</span> {selectedCampsite.price}
              </p>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                onClick={() => {
                  router.push(`/${locale}/campsites/${selectedCampsite.id}`)
                }}
              >
                {t('map.viewDetails')}
              </button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  )
}
