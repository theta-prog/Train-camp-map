import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface SearchFiltersProps {
  onFilterChange: (filters: {
    keyword: string
    maxPrice: number
    facilities: string[]
    activities: string[]
  }) => void
  initialFilters: {
    keyword: string
    maxPrice: number
    facilities: string[]
    activities: string[]
  }
}

const availableFacilities = [
  'toilet',
  'shower',
  'kitchen',
  'rental',
  'shop',
  'parking',
  'wifi'
]

const availableActivities = [
  'hiking',
  'bbq',
  'fishing',
  'canoe',
  'boat',
  'river',
  'stargazing'
]

export default function SearchFilters({ onFilterChange, initialFilters }: SearchFiltersProps) {
  const t = useTranslations()
  const [keyword, setKeyword] = useState(initialFilters.keyword)
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice)
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initialFilters.facilities)
  const [selectedActivities, setSelectedActivities] = useState<string[]>(initialFilters.activities)

  useEffect(() => {
    onFilterChange({
      keyword,
      maxPrice,
      facilities: selectedFacilities,
      activities: selectedActivities
    })
  }, [keyword, maxPrice, selectedFacilities, selectedActivities, onFilterChange])

  const handleFacilityChange = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    )
  }

  const handleActivityChange = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const clearFilters = () => {
    setKeyword('')
    setMaxPrice(10000)
    setSelectedFacilities([])
    setSelectedActivities([])
    
    // すぐにフィルターを適用
    onFilterChange({
      keyword: '',
      maxPrice: 10000,
      facilities: [],
      activities: []
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{t('searchFilters.title')}</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('searchFilters.clear')}
        </button>
      </div>

      {/* キーワード検索 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchFilters.keyword')}
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('searchFilters.keywordPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 価格フィルター */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchFilters.maxPrice')}: ¥{maxPrice.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>¥1,000</span>
          <span>¥10,000</span>
        </div>
      </div>

      {/* 設備フィルター */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchFilters.facilities')}
        </label>
        <div className="space-y-2">
          {availableFacilities.map((facility) => (
            <label key={facility} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility)}
                onChange={() => handleFacilityChange(facility)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{t(`facilities.${facility}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* アクティビティフィルター */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchFilters.activities')}
        </label>
        <div className="space-y-2">
          {availableActivities.map((activity) => (
            <label key={activity} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity)}
                onChange={() => handleActivityChange(activity)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{t(`activities.${activity}`)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600">
          {selectedFacilities.length > 0 || selectedActivities.length > 0 || keyword 
            ? t('searchFilters.matchingCampsites')
            : t('searchFilters.allCampsites')
          }
        </p>
      </div>
    </div>
  )
}
