'use client'

import {
  AVAILABLE_ACTIVITIES,
  AVAILABLE_FACILITIES,
  CampsiteFormData,
  campsiteSchema
} from '@/lib/validations/campsite'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import MapPicker from './MapPicker'
import ImageUploader from './ImageUploader'

interface CampsiteFormProps {
  onSubmit: (data: CampsiteFormData) => Promise<void>
  initialData?: Partial<CampsiteFormData>
  isLoading?: boolean
}

export default function CampsiteForm({ 
  onSubmit, 
  initialData, 
  isLoading = false 
}: CampsiteFormProps) {
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    initialData?.facilities || []
  )
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    initialData?.activities || []
  )
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || []
  )
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialData?.lat || 35.6762,
    lng: initialData?.lng || 139.6503
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CampsiteFormData>({
    resolver: zodResolver(campsiteSchema),
    mode: 'onBlur', // Enable validation on blur
    defaultValues: {
      name_ja: '',
      name_en: '',
      lat: initialData?.lat,
      lng: initialData?.lng,
      address_ja: '',
      address_en: '',
      phone: '',
      website: '',
      price: '',
      nearest_station_ja: '',
      nearest_station_en: '',
      access_time_ja: '',
      access_time_en: '',
      description_ja: '',
      description_en: '',
      facilities: [],
      activities: [],
      ...initialData,
    },
  })

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    const updated = checked
      ? [...selectedFacilities, facilityId]
      : selectedFacilities.filter(id => id !== facilityId)
    
    setSelectedFacilities(updated)
    setValue('facilities', updated)
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setValue('lat', lat)
    setValue('lng', lng)
  }

  const handleActivityChange = (activityId: string, checked: boolean) => {
    const updated = checked
      ? [...selectedActivities, activityId]
      : selectedActivities.filter(id => id !== activityId)
    
    setSelectedActivities(updated)
    setValue('activities', updated)
  }

  const onFormSubmit = async (data: CampsiteFormData) => {
    await onSubmit({
      ...data,
      facilities: selectedFacilities,
      activities: selectedActivities,
      images: imageUrls,
    })
  }

  const handleAddImage = (newUrls: string[]) => {
    const updatedImages = [...imageUrls, ...newUrls]
    setImageUrls(updatedImages)
    setValue('images', updatedImages)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImages)
    setValue('images', newImages)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* 基本情報 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name_ja" className="block text-sm font-medium text-gray-700 mb-1">
              名前（日本語）*
            </label>
            <input
              id="name_ja"
              type="text"
              {...register('name_ja')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 高尾山キャンプ場"
            />
            {errors.name_ja && (
              <p className="mt-1 text-sm text-red-600">{errors.name_ja.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name_en" className="block text-sm font-medium text-gray-700 mb-1">
              名前（英語）
            </label>
            <input
              id="name_en"
              type="text"
              {...register('name_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g. Takao Mountain Campsite"
            />
            {errors.name_en && (
              <p className="mt-1 text-sm text-red-600">{errors.name_en.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 位置情報 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">位置情報</h3>
        
        {/* Google Map による位置選択 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            地図から位置を選択
          </label>
          <MapPicker
            lat={selectedLocation.lat}
            lng={selectedLocation.lng}
            onLocationSelect={handleLocationSelect}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
              緯度（手動入力・オプション）
            </label>
            <input
              id="lat"
              type="number"
              step="any"
              {...register('lat', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 35.6762"
            />
            {errors.lat && (
              <p className="mt-1 text-sm text-red-600">{errors.lat.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
              経度（手動入力・オプション）
            </label>
            <input
              id="lng"
              type="number"
              step="any"
              {...register('lng', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 139.6503"
            />
            {errors.lng && (
              <p className="mt-1 text-sm text-red-600">{errors.lng.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="address_ja" className="block text-sm font-medium text-gray-700 mb-1">
              住所（日本語）*
            </label>
            <input
              id="address_ja"
              type="text"
              {...register('address_ja')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 東京都八王子市高尾町"
            />
            {errors.address_ja && (
              <p className="mt-1 text-sm text-red-600">{errors.address_ja.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address_en" className="block text-sm font-medium text-gray-700 mb-1">
              住所（英語）
            </label>
            <input
              id="address_en"
              type="text"
              {...register('address_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g. Takao-cho, Hachioji-shi, Tokyo"
            />
            {errors.address_en && (
              <p className="mt-1 text-sm text-red-600">{errors.address_en.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 連絡先情報 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 042-123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              公式ウェブサイト
            </label>
            <input
              id="website"
              type="url"
              {...register('website')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: https://example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="reservationUrl" className="block text-sm font-medium text-gray-700 mb-1">
            予約サイトURL
          </label>
          <input
            id="reservationUrl"
            type="url"
            {...register('reservationUrl')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="例: https://reservation.example.com"
          />
          {errors.reservationUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.reservationUrl.message}</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">料金情報</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                表示用料金*
              </label>
              <input
                id="price"
                type="text"
                {...register('price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: ¥2,000-¥5,000/泊 or ¥3,000/泊"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                最小料金（円）
              </label>
              <input
                id="priceMin"
                type="number"
                {...register('priceMin', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: 2000"
              />
              {errors.priceMin && (
                <p className="mt-1 text-sm text-red-600">{errors.priceMin.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                最大料金（円）
              </label>
              <input
                id="priceMax"
                type="number"
                {...register('priceMax', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: 5000"
              />
              {errors.priceMax && (
                <p className="mt-1 text-sm text-red-600">{errors.priceMax.message}</p>
              )}
            </div>
          </div>
          
          {/* チェックイン・チェックアウト情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700 mb-1">
                チェックイン時間
              </label>
              <input
                id="checkInTime"
                type="text"
                {...register('checkInTime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: 14:00"
              />
              {errors.checkInTime && (
                <p className="mt-1 text-sm text-red-600">{errors.checkInTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700 mb-1">
                チェックアウト時間
              </label>
              <input
                id="checkOutTime"
                type="text"
                {...register('checkOutTime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: 11:00"
              />
              {errors.checkOutTime && (
                <p className="mt-1 text-sm text-red-600">{errors.checkOutTime.message}</p>
              )}
            </div>
          </div>

          {/* キャンセルポリシー */}
          <div className="mt-6">
            <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700 mb-1">
              キャンセルポリシー
            </label>
            <textarea
              id="cancellationPolicy"
              {...register('cancellationPolicy')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="キャンセル料金や注意事項を記載してください"
            />
            {errors.cancellationPolicy && (
              <p className="mt-1 text-sm text-red-600">{errors.cancellationPolicy.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* アクセス情報 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">アクセス情報</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nearest_station_ja" className="block text-sm font-medium text-gray-700 mb-1">
              最寄り駅（日本語）*
            </label>
            <input
              id="nearest_station_ja"
              type="text"
              {...register('nearest_station_ja')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: JR高尾駅"
            />
            {errors.nearest_station_ja && (
              <p className="mt-1 text-sm text-red-600">{errors.nearest_station_ja.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nearest_station_en" className="block text-sm font-medium text-gray-700 mb-1">
              最寄り駅（英語）
            </label>
            <input
              id="nearest_station_en"
              type="text"
              {...register('nearest_station_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g. JR Takao Station"
            />
            {errors.nearest_station_en && (
              <p className="mt-1 text-sm text-red-600">{errors.nearest_station_en.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="access_time_ja" className="block text-sm font-medium text-gray-700 mb-1">
              アクセス時間（日本語）*
            </label>
            <input
              id="access_time_ja"
              type="text"
              {...register('access_time_ja')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="例: 徒歩15分"
            />
            {errors.access_time_ja && (
              <p className="mt-1 text-sm text-red-600">{errors.access_time_ja.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="access_time_en" className="block text-sm font-medium text-gray-700 mb-1">
              アクセス時間（英語）
            </label>
            <input
              id="access_time_en"
              type="text"
              {...register('access_time_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g. 15 min walk"
            />
            {errors.access_time_en && (
              <p className="mt-1 text-sm text-red-600">{errors.access_time_en.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 説明 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">説明</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="description_ja" className="block text-sm font-medium text-gray-700 mb-1">
              説明（日本語）*
            </label>
            <textarea
              id="description_ja"
              {...register('description_ja')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="キャンプ場の特徴や魅力を詳しく説明してください"
            />
            {errors.description_ja && (
              <p className="mt-1 text-sm text-red-600">{errors.description_ja.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-1">
              説明（英語）
            </label>
            <textarea
              id="description_en"
              {...register('description_en')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Please describe the features and attractions of the campsite"
            />
            {errors.description_en && (
              <p className="mt-1 text-sm text-red-600">{errors.description_en.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 設備 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">設備</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AVAILABLE_FACILITIES.map((facility) => (
            <label key={facility.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility.id)}
                onChange={(e) => handleFacilityChange(facility.id, e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{facility.label_ja}</span>
            </label>
          ))}
        </div>
      </div>

      {/* アクティビティ */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">アクティビティ</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AVAILABLE_ACTIVITIES.map((activity) => (
            <label key={activity.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity.id)}
                onChange={(e) => handleActivityChange(activity.id, e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{activity.label_ja}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 画像管理 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">画像</h3>
        
        {/* 現在の画像一覧 */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="relative w-full h-32">
                    <img
                      src={url}
                      alt={`画像 ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNDBDMTA2LjYyNyA0MCAxMTIgNDUuMzczIDExMiA1MkMxMTIgNTguNjI3IDEwNi42MjcgNjQgMTAwIDY0QzkzLjM3MyA2NCA4OCA1OC42MjcgODggNTJDODggNDUuMzczIDkzLjM3MyA0MCAxMDAgNDBaIiBmaWxsPSIjOUI5QkE0Ii8+CjxwYXRoIGQ9Ik04MCA3NkwxMDAgNTZMMTIwIDc2SDE2MEwxNDAgNTZMMTcwIDg2SDE3NlY5MkgxNzZIMjRWOTJIMjRMNTQgNjJMODAgNzZaIiBmaWxsPSIjOUI5QkE0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTA0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+dum7vOOBn+OBruiqreOBv+i+vOOBv+OBq+WksOaVlzwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p className="mt-2 text-xs text-gray-500 truncate">{url}</p>
              </div>
            ))}
          </div>
        )}

        {/* ファイルアップローダー */}
        <ImageUploader
          campsiteId={initialData?.id || 'new-campsite'}
          onImagesUploaded={handleAddImage}
          existingImages={imageUrls}
          maxImages={10}
        />
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => window.history.back()}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
}
