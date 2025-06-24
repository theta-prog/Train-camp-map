'use client'

import { Campsite } from '@/types/campsite'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import LanguageSwitcher from './LanguageSwitcher'

interface CampsiteDetailProps {
  campsite: Campsite
}

export default function CampsiteDetail({ campsite }: CampsiteDetailProps) {
  const t = useTranslations()
  const params = useParams()
  const locale = (params?.locale as 'ja' | 'en') || 'ja'
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <Link 
            href="/" 
            className="text-green-600 hover:text-green-700 text-sm inline-block"
          >
            ← {t('campsiteDetail.backToList')}
          </Link>
          <LanguageSwitcher />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {campsite.name[locale]}
        </h1>
        <p className="text-gray-600">{campsite.address[locale]}</p>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左カラム - 詳細情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 画像ギャラリー */}
          {campsite.images && campsite.images.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {campsite.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() => window.open(image, '_blank')}
                  >
                    <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${campsite.name[locale]} - ${locale === 'ja' ? '画像' : 'Image'} ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => {
                          // エラー時のフォールバック処理は後で実装
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 説明 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('campsiteDetail.description')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {campsite.description[locale]}
            </p>
          </div>

          {/* 設備 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('searchFilters.facilities')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {campsite.facilities.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {t(`facilities.${facility}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* アクティビティ */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('searchFilters.activities')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {campsite.activities.map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {t(`activities.${activity}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右カラム - 基本情報・地図 */}
        <div className="space-y-6">
          {/* 基本情報カード */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('campsiteDetail.basicInfo')}
            </h2>
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('campsiteList.price')}
                </dt>
                <dd className="text-lg font-semibold text-green-600">
                  {campsite.price}
                </dd>
              </div>
              
              {(campsite.checkInTime || campsite.checkOutTime) && (
                <div className="border-t border-gray-100 pt-4">
                  <dt className="text-sm font-medium text-gray-500 mb-2">
                    {t('campsiteDetail.checkInOut')}
                  </dt>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {campsite.checkInTime && (
                      <div>
                        <span className="text-gray-600">
                          {t('campsiteDetail.checkIn')} 
                        </span>
                        <span className="text-gray-900 font-medium ml-1">
                          {campsite.checkInTime}
                        </span>
                      </div>
                    )}
                    {campsite.checkOutTime && (
                      <div>
                        <span className="text-gray-600">
                          {t('campsiteDetail.checkOut')} 
                        </span>
                        <span className="text-gray-900 font-medium ml-1">
                          {campsite.checkOutTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-4">
                <dt className="text-sm font-medium text-gray-500">
                  {t('campsiteList.nearestStation')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {campsite.nearestStation[locale]}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t('campsiteList.access')}
                </dt>
                <dd className="text-sm text-gray-900">
                  {campsite.accessTime[locale]}
                </dd>
              </div>
              
              {campsite.phone && (
                <div className="border-t border-gray-100 pt-4">
                  <dt className="text-sm font-medium text-gray-500">
                    {t('campsiteDetail.phone')}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    <a href={`tel:${campsite.phone}`} className="text-green-600 hover:text-green-700">
                      {campsite.phone}
                    </a>
                  </dd>
                </div>
              )}
            </div>
          </div>

          {/* 予約・リンクカード */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('campsiteDetail.bookingLinks')}
            </h2>
            <div className="space-y-3">
              {campsite.reservationUrl && (
                <a
                  href={campsite.reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-md font-medium transition-colors"
                >
                  {t('campsiteDetail.makeReservation')} ↗
                </a>
              )}
              
              {campsite.website && (
                <a
                  href={campsite.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-3 px-4 rounded-md font-medium transition-colors"
                >
                  {t('campsiteDetail.officialWebsite')} ↗
                </a>
              )}
              
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${campsite.lat},${campsite.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-center py-3 px-4 rounded-md font-medium transition-colors"
              >
                {t('campsiteDetail.openInMaps')} ↗
              </a>
            </div>
          </div>

          {/* キャンセルポリシー */}
          {campsite.cancellationPolicy && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('campsiteDetail.cancellationPolicy')}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {campsite.cancellationPolicy}
              </p>
            </div>
          )}

          {/* 地図 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('campsiteDetail.location')}
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  {t('campsiteDetail.address')}
                </p>
                <p className="text-gray-900 font-medium">
                  {campsite.address[locale]}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  {t('campsiteDetail.coordinates')}
                </p>
                <p className="text-gray-900 font-mono text-sm">
                  {campsite.lat.toFixed(6)}, {campsite.lng.toFixed(6)}
                </p>
              </div>

              {/* Google Maps 埋め込み */}
              {apiKey && (
                <div className="mt-4">
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <APIProvider apiKey={apiKey}>
                      <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={{ lat: campsite.lat, lng: campsite.lng }}
                        defaultZoom={15}
                        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || null}
                        gestureHandling={'greedy'}
                        disableDefaultUI={false}
                      >
                        <AdvancedMarker
                          position={{ lat: campsite.lat, lng: campsite.lng }}
                        />
                      </Map>
                    </APIProvider>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
