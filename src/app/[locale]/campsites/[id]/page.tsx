'use client'

import { Campsite } from '@/types/campsite'
import { mapActivityToTranslationKey, mapFacilityToTranslationKey } from '@/utils/facilityMapper'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CampsiteDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = (params?.locale as string) || 'ja'
  const campsiteId = params?.id as string
  
  const [campsite, setCampsite] = useState<Campsite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCampsite() {
      try {
        setLoading(true)
        setError(null)
        
        // 全キャンプサイトから該当のものを探す
        const response = await fetch('/api/campsites')
        if (!response.ok) {
          throw new Error('Failed to fetch campsites')
        }
        
        const data = await response.json()
        const foundCampsite = data.campsites?.find((c: any) => c.id === campsiteId)
        
        if (!foundCampsite) {
          throw new Error('Campsite not found')
        }

        // API response to frontend format
        const transformedCampsite: Campsite = {
          id: foundCampsite.id,
          name: foundCampsite.nameJa,
          lat: foundCampsite.lat,
          lng: foundCampsite.lng,
          address: foundCampsite.addressJa,
          phone: foundCampsite.phone || '',
          website: foundCampsite.website || '',
          price: foundCampsite.price,
          facilities: foundCampsite.facilities || [],
          activities: foundCampsite.activities || [],
          nearestStation: foundCampsite.nearestStationJa,
          accessTime: foundCampsite.accessTimeJa,
          description: foundCampsite.descriptionJa,
          images: foundCampsite.images || [],
          reservationUrl: foundCampsite.reservationUrl,
          priceMin: foundCampsite.priceMin,
          priceMax: foundCampsite.priceMax
        }

        setCampsite(transformedCampsite)
      } catch (err) {
        console.error('Failed to fetch campsite:', err)
        setError('キャンプサイトの情報を取得できませんでした')
      } finally {
        setLoading(false)
      }
    }

    if (campsiteId) {
      fetchCampsite()
    }
  }, [campsiteId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !campsite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">キャンプサイトが見つかりません</h1>
          <p className="text-gray-600 mb-6">{error || 'キャンプサイトが存在しないか、削除された可能性があります。'}</p>
          <Link
            href={`/${locale}`}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ナビゲーション */}
        <nav className="mb-6">
          <Link
            href={`/${locale}`}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            ← キャンプサイト一覧に戻る
          </Link>
        </nav>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{campsite.name}</h1>
            <p className="text-green-100">{campsite.address}</p>
          </div>

          <div className="p-6">
            {/* 基本情報 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">基本情報</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-24 text-sm font-medium text-gray-600">料金:</span>
                    <span className="text-lg font-semibold text-green-600">{campsite.price}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm font-medium text-gray-600">電話:</span>
                    <span className="text-gray-800">{campsite.phone || '-'}</span>
                  </div>
                  {campsite.website && (
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-600">Web:</span>
                      <a
                        href={campsite.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        公式サイト
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">アクセス</h2>
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-600 mb-1">最寄り駅:</span>
                    <span className="text-gray-800">{campsite.nearestStation}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600 mb-1">アクセス時間:</span>
                    <span className="text-gray-800">{campsite.accessTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 説明 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">説明</h2>
              <p className="text-gray-700 leading-relaxed">{campsite.description}</p>
            </div>

            {/* 設備 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">設備</h2>
              <div className="flex flex-wrap gap-2">
                {campsite.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {t(`facilities.${mapFacilityToTranslationKey(facility)}`)}
                  </span>
                ))}
              </div>
            </div>

            {/* アクティビティ */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">アクティビティ</h2>
              <div className="flex flex-wrap gap-2">
                {campsite.activities.map((activity) => (
                  <span
                    key={activity}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {t(`activities.${mapActivityToTranslationKey(activity)}`)}
                  </span>
                ))}
              </div>
            </div>

            {/* 予約ボタン */}
            {campsite.reservationUrl && (
              <div className="text-center">
                <a
                  href={campsite.reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  予約サイトで確認
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
