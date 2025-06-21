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
    })
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
              ウェブサイト
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
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            料金*
          </label>
          <input
            id="price"
            type="text"
            {...register('price')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="例: ¥2,000/泊"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
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
