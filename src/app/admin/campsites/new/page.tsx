'use client'

import AddressGeocoder from '@/components/admin/AddressGeocoder'
import AdminLayout from '@/components/admin/AdminLayout'
import CampsiteForm from '@/components/admin/CampsiteForm'
import CampsiteTemplate from '@/components/admin/CampsiteTemplate'
import DuplicateChecker from '@/components/admin/DuplicateChecker'
import MapAddComponent from '@/components/admin/MapAddComponent'
import { CampsiteFormData } from '@/lib/validations/campsite'
import { Campsite } from '@/types/campsite'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NewCampsitePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<CampsiteFormData>>({})
  const [duplicates, setDuplicates] = useState<Campsite[]>([])
  const [existingCampsites, setExistingCampsites] = useState<Campsite[]>([])
  const [showHelpers, setShowHelpers] = useState(true)
  const router = useRouter()

  // 既存のキャンプ場データを取得
  useEffect(() => {
    const fetchCampsites = async () => {
      try {
        const response = await fetch('/api/campsites')
        const result = await response.json()
        if (response.ok && result.data) {
          setExistingCampsites(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch existing campsites:', error)
      }
    }
    fetchCampsites()
  }, [])

  // テンプレート選択時の処理
  const handleTemplateSelect = (template: Partial<CampsiteFormData>) => {
    setFormData(prev => ({ ...prev, ...template }))
  }

  // 住所検索時の処理
  const handleLocationFound = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      address_ja: address
    }))
  }

  // 地図クリック時の処理
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }))
  }

  // 重複チェック結果の処理
  const handleDuplicateFound = (foundDuplicates: Campsite[]) => {
    setDuplicates(foundDuplicates)
  }

  const handleSubmit = async (data: CampsiteFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/campsites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'キャンプ場の登録に失敗しました')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/campsites')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新規キャンプ場登録</h1>
            <p className="mt-1 text-gray-600">
              新しいキャンプ場の情報を入力してください
            </p>
          </div>
          <button
            onClick={() => setShowHelpers(!showHelpers)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showHelpers ? '効率化ツールを隠す' : '効率化ツールを表示'}
          </button>
        </div>

        {/* 効率化ヘルパー */}
        {showHelpers && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">効率化ツール</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* テンプレート選択 */}
              <CampsiteTemplate onTemplateSelect={handleTemplateSelect} />
              
              {/* 住所から位置検索 */}
              <AddressGeocoder onLocationFound={handleLocationFound} />
              
              {/* 重複チェック */}
              <DuplicateChecker 
                formData={formData}
                onDuplicateFound={handleDuplicateFound}
              />
              
              {/* 地図での位置選択 */}
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">地図で位置を選択</h3>
                  <MapAddComponent
                    onLocationSelect={handleMapLocationSelect}
                    selectedLocation={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : null}
                    existingCampsites={existingCampsites}
                  />
                  {formData.lat && formData.lng && (
                    <div className="mt-2 text-sm text-gray-600">
                      選択位置: 緯度 {formData.lat.toFixed(6)}, 経度 {formData.lng.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 重複警告 */}
            {duplicates.length > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      類似のキャンプ場が見つかりました
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside">
                        {duplicates.map((campsite, index) => (
                          <li key={index}>
                            {campsite.name.ja} - {campsite.address.ja}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2">重複していないか確認してください。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  エラーが発生しました
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 成功メッセージ */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  登録完了
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  キャンプ場の登録が完了しました。キャンプ場一覧ページに移動します...
                </div>
              </div>
            </div>
          </div>
        )}

        <CampsiteForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          initialData={formData as any}
        />
      </div>
    </AdminLayout>
  )
}
