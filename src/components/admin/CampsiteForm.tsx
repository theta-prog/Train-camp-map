'use client'

import { CampsiteFormData, campsiteSchema, AVAILABLE_FACILITIES, AVAILABLE_ACTIVITIES } from '@/lib/validations/campsite'
import { useState } from 'react'
import { z } from 'zod'

interface CampsiteFormProps {
  initialData?: Partial<CampsiteFormData>
  onSubmit: (data: CampsiteFormData) => Promise<void>
  submitButtonText?: string
  isEditMode?: boolean
  isLoading?: boolean
}

export default function CampsiteForm({ 
  initialData = {}, 
  onSubmit, 
  submitButtonText = '保存',
  isEditMode: _isEditMode = false,
  isLoading: _externalLoading = false
}: CampsiteFormProps) {
  const [formData, setFormData] = useState<Partial<CampsiteFormData>>({
    name_ja: '',
    name_en: '',
    address_ja: '',
    address_en: '',
    lat: undefined,
    lng: undefined,
    phone: '',
    website: '',
    reservationUrl: '',
    price: '',
    priceMin: undefined,
    priceMax: undefined,
    check_in_time: '',
    check_out_time: '',
    cancellation_policy_ja: '',
    cancellation_policy_en: '',
    nearest_station_ja: '',
    nearest_station_en: '',
    access_time_ja: '',
    access_time_en: '',
    description_ja: '',
    description_en: '',
    facilities: [],
    activities: [],
    images: [],
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CampsiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCheckboxChange = (field: 'facilities' | 'activities', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] || []
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const validatedData = campsiteSchema.parse(formData)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error('Submit error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キャンプ場名（日本語）*
            </label>
            <input
              type="text"
              value={formData.name_ja || ''}
              onChange={(e) => handleInputChange('name_ja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name_ja && <p className="text-red-500 text-sm mt-1">{errors.name_ja}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キャンプ場名（英語）
            </label>
            <input
              type="text"
              value={formData.name_en || ''}
              onChange={(e) => handleInputChange('name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>}
          </div>
        </div>
      </div>

      {/* 住所・位置情報 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">住所・位置情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所（日本語）*
            </label>
            <input
              type="text"
              value={formData.address_ja || ''}
              onChange={(e) => handleInputChange('address_ja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.address_ja && <p className="text-red-500 text-sm mt-1">{errors.address_ja}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所（英語）
            </label>
            <input
              type="text"
              value={formData.address_en || ''}
              onChange={(e) => handleInputChange('address_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.address_en && <p className="text-red-500 text-sm mt-1">{errors.address_en}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              緯度
            </label>
            <input
              type="number"
              step="any"
              value={formData.lat || ''}
              onChange={(e) => handleInputChange('lat', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.lat && <p className="text-red-500 text-sm mt-1">{errors.lat}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              経度
            </label>
            <input
              type="number"
              step="any"
              value={formData.lng || ''}
              onChange={(e) => handleInputChange('lng', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.lng && <p className="text-red-500 text-sm mt-1">{errors.lng}</p>}
          </div>
        </div>
      </div>

      {/* 連絡先・予約情報 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">連絡先・予約情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ウェブサイト
            </label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              予約URL
            </label>
            <input
              type="url"
              value={formData.reservationUrl || ''}
              onChange={(e) => handleInputChange('reservationUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.reservationUrl && <p className="text-red-500 text-sm mt-1">{errors.reservationUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              料金*
            </label>
            <input
              type="text"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="例: 3,000円/泊"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>
      </div>

      {/* チェックイン・チェックアウト */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">チェックイン・チェックアウト</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              チェックイン時間
            </label>
            <input
              type="text"
              value={formData.check_in_time || ''}
              onChange={(e) => handleInputChange('check_in_time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="例: 15:00"
            />
            {errors.check_in_time && <p className="text-red-500 text-sm mt-1">{errors.check_in_time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              チェックアウト時間
            </label>
            <input
              type="text"
              value={formData.check_out_time || ''}
              onChange={(e) => handleInputChange('check_out_time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="例: 10:00"
            />
            {errors.check_out_time && <p className="text-red-500 text-sm mt-1">{errors.check_out_time}</p>}
          </div>
        </div>
      </div>

      {/* アクセス情報 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">アクセス情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最寄り駅（日本語）*
            </label>
            <input
              type="text"
              value={formData.nearest_station_ja || ''}
              onChange={(e) => handleInputChange('nearest_station_ja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.nearest_station_ja && <p className="text-red-500 text-sm mt-1">{errors.nearest_station_ja}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最寄り駅（英語）
            </label>
            <input
              type="text"
              value={formData.nearest_station_en || ''}
              onChange={(e) => handleInputChange('nearest_station_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.nearest_station_en && <p className="text-red-500 text-sm mt-1">{errors.nearest_station_en}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              アクセス時間（日本語）*
            </label>
            <input
              type="text"
              value={formData.access_time_ja || ''}
              onChange={(e) => handleInputChange('access_time_ja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.access_time_ja && <p className="text-red-500 text-sm mt-1">{errors.access_time_ja}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              アクセス時間（英語）
            </label>
            <input
              type="text"
              value={formData.access_time_en || ''}
              onChange={(e) => handleInputChange('access_time_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.access_time_en && <p className="text-red-500 text-sm mt-1">{errors.access_time_en}</p>}
          </div>
        </div>
      </div>

      {/* 説明 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">説明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明（日本語）*
            </label>
            <textarea
              rows={4}
              value={formData.description_ja || ''}
              onChange={(e) => handleInputChange('description_ja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.description_ja && <p className="text-red-500 text-sm mt-1">{errors.description_ja}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明（英語）
            </label>
            <textarea
              rows={4}
              value={formData.description_en || ''}
              onChange={(e) => handleInputChange('description_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.description_en && <p className="text-red-500 text-sm mt-1">{errors.description_en}</p>}
          </div>
        </div>
      </div>

      {/* キャンセルポリシー */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">キャンセルポリシー</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キャンセルポリシー（日本語）
            </label>
            <textarea
              rows={3}
              value={formData.cancellation_policy_ja || ''}
              onChange={(e) => handleInputChange('cancellation_policy_ja', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.cancellation_policy_ja && <p className="text-red-500 text-sm mt-1">{errors.cancellation_policy_ja}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キャンセルポリシー（英語）
            </label>
            <textarea
              rows={3}
              value={formData.cancellation_policy_en || ''}
              onChange={(e) => handleInputChange('cancellation_policy_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.cancellation_policy_en && <p className="text-red-500 text-sm mt-1">{errors.cancellation_policy_en}</p>}
          </div>
        </div>
      </div>

      {/* 設備 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">設備</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AVAILABLE_FACILITIES.map((facility) => (
            <label key={facility.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities?.includes(facility.id) || false}
                onChange={(e) => handleCheckboxChange('facilities', facility.id, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{facility.label_ja}</span>
            </label>
          ))}
        </div>
      </div>

      {/* アクティビティ */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">アクティビティ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AVAILABLE_ACTIVITIES.map((activity) => (
            <label key={activity.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.activities?.includes(activity.id) || false}
                onChange={(e) => handleCheckboxChange('activities', activity.id, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{activity.label_ja}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : submitButtonText}
        </button>
      </div>
    </form>
  )
}
