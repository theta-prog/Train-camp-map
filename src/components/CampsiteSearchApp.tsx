'use client'

import CampsiteList from '@/components/CampsiteList'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import SearchFilters from '@/components/SearchFilters'
import { Campsite } from '@/types/campsite'
import { extractPriceFromString, fetchCampsites } from '@/utils/campsiteApi'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'

// MapComponentを動的インポートしてSSRを無効化
const MapComponent = dynamic(
  /* istanbul ignore next */ () => import('@/components/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ width: '100%', height: '600px' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
)

export default function CampsiteSearchApp() {
  const t = useTranslations()
  const [selectedCampsite, setSelectedCampsite] = useState<Campsite | null>(null)
  const [allCampsites, setAllCampsites] = useState<Campsite[]>([])
  const [filteredCampsites, setFilteredCampsites] = useState<Campsite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    maxPrice: 10000,
    facilities: [] as string[],
    activities: [] as string[]
  })
  const [isFiltersInitialized, setIsFiltersInitialized] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // キャンプサイトデータを取得
  useEffect(() => {
    async function loadCampsites() {
      try {
        setIsLoading(true)
        setError(null)
        const campsites = await fetchCampsites()
        setAllCampsites(campsites)
        setFilteredCampsites(campsites)
      } catch (err) {
        console.error('Failed to load campsites:', err)
        setError('キャンプサイトの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    loadCampsites()
  }, [])

  const handleFilterChange = useCallback((filters: typeof searchFilters) => {
    setSearchFilters(filters)
    
    if (!isFiltersInitialized) {
      setIsFiltersInitialized(true)
      return // 初回は何もしない
    }
    
    let filtered = allCampsites.filter((campsite: Campsite) => {
      const keywordLower = filters.keyword.toLowerCase()
      const keywordMatch = !filters.keyword || 
        campsite.name.toLowerCase().includes(keywordLower) ||
        campsite.address.toLowerCase().includes(keywordLower) ||
        campsite.nearestStation.toLowerCase().includes(keywordLower)
      
      const priceValue = extractPriceFromString(campsite.price)
      const priceWithinLimit = priceValue <= filters.maxPrice
      
      const facilitiesMatch = filters.facilities.length === 0 || 
        filters.facilities.some((facility: string) => campsite.facilities.includes(facility))
      
      const activitiesMatch = filters.activities.length === 0 || 
        filters.activities.some((activity: string) => campsite.activities.includes(activity))
      
      return keywordMatch && priceWithinLimit && facilitiesMatch && activitiesMatch
    })
    
    setFilteredCampsites(filtered)
  }, [isFiltersInitialized, allCampsites])

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">{t('map.apiKeyMissing')}</p>
          <p className="text-sm text-gray-500">
            {t('map.apiKeyInstruction')}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <APIProvider apiKey={apiKey}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">キャンプサイトを読み込み中...</p>
          </div>
        </div>
      </APIProvider>
    )
  }

  if (error) {
    return (
      <APIProvider apiKey={apiKey}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              再読み込み
            </button>
          </div>
        </div>
      </APIProvider>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  {t('title')}
                </h1>
                <p className="text-green-100">
                  {t('subtitle')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters 
                onFilterChange={handleFilterChange}
                initialFilters={searchFilters}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <MapComponent 
                  campsites={filteredCampsites}
                  onCampsiteSelect={setSelectedCampsite}
                  selectedCampsite={selectedCampsite}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <CampsiteList 
                campsites={filteredCampsites}
                onCampsiteSelect={setSelectedCampsite}
                selectedCampsite={selectedCampsite}
              />
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  )
}
