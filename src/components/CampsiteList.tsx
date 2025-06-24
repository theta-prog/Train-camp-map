import { Campsite } from '@/types/campsite'
import { mapActivityToTranslationKey, mapFacilityToTranslationKey } from '@/utils/facilityMapper'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface CampsiteListProps {
  campsites: Campsite[]
  onCampsiteSelect: (campsite: Campsite | null) => void
  selectedCampsite: Campsite | null
}

export default function CampsiteList({ 
  campsites, 
  onCampsiteSelect, 
  selectedCampsite 
}: CampsiteListProps) {
  const t = useTranslations()
  const params = useParams()
  const locale = (params?.locale as 'ja' | 'en') || 'ja'
  
  const handleCampsiteClick = (campsite: Campsite) => {
    onCampsiteSelect(campsite)
  }

  if (campsites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('campsiteList.title')}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">{t('campsiteList.noResults')}</p>
          <p className="text-sm text-gray-400 mt-2">{t('campsiteList.changeFilters')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">
          {t('campsiteList.title')} ({t('campsiteList.count', { count: campsites.length })})
        </h2>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {campsites.map((campsite) => (
          <div
            key={campsite.id}
            onClick={() => handleCampsiteClick(campsite)}
            className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedCampsite?.id === campsite.id ? 'bg-green-50 border-green-200' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 text-sm">{campsite.name[locale]}</h3>
              <span className="text-sm font-medium text-green-600">{campsite.price}</span>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{campsite.address[locale]}</p>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-xs text-gray-600">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="font-medium">{t('campsiteList.nearestStation')}:</span>
                <span className="ml-1">{campsite.nearestStation[locale]}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="font-medium">{t('campsiteList.access')}:</span>
                <span className="ml-1">{campsite.accessTime[locale]}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <p className="text-xs text-gray-700 line-clamp-2">{campsite.description[locale]}</p>
            </div>
            
            {/* 設備アイコン */}
            <div className="flex flex-wrap gap-1 mb-2">
              {campsite.facilities.slice(0, 3).map((facility) => (
                <span
                  key={facility}
                  className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                >
                  {t(`facilities.${mapFacilityToTranslationKey(facility)}`)}
                </span>
              ))}
              {campsite.facilities.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                  +{campsite.facilities.length - 3}
                </span>
              )}
            </div>
            
            {/* アクティビティ */}
            <div className="flex flex-wrap gap-1 mb-3">
              {campsite.activities.slice(0, 2).map((activity) => (
                <span
                  key={activity}
                  className="inline-block px-2 py-1 bg-green-100 text-xs text-green-700 rounded"
                >
                  {t(`activities.${mapActivityToTranslationKey(activity)}`)}
                </span>
              ))}
              {campsite.activities.length > 2 && (
                <span className="inline-block px-2 py-1 bg-green-100 text-xs text-green-700 rounded">
                  +{campsite.activities.length - 2}
                </span>
              )}
            </div>
            
            {/* 詳細ページリンク */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {locale === 'ja' ? 'クリックして地図表示' : 'Click to show on map'}
              </span>
              <Link
                href={`/${locale}/campsites/${campsite.id}`}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {locale === 'ja' ? '詳細を見る' : 'View Details'} →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t bg-gray-50 text-center">
        <p className="text-xs text-gray-500">
          {t('campsiteList.clickForDetails')}
        </p>
      </div>
    </div>
  )
}
