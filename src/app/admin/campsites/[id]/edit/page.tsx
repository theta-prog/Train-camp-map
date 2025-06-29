'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import CampsiteForm from '@/components/admin/CampsiteForm'
import { CampsiteFormData } from '@/lib/validations/campsite'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CampsiteEditPageProps {
  params: {
    id: string
  }
}

export default function CampsiteEditPage({ params }: CampsiteEditPageProps) {
  const router = useRouter()
  const [campsite, setCampsite] = useState<CampsiteFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCampsite = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/campsites/${params.id}`)
        const result = await response.json()

        if (response.ok) {
          // APIレスポンス（キャメルケース）をフォーム用（スネークケース）に変換
          const formData = {
            name_ja: result.data.name.ja,
            name_en: result.data.name.en,
            address_ja: result.data.address.ja,
            address_en: result.data.address.en,
            lat: result.data.lat,
            lng: result.data.lng,
            phone: result.data.phone || '',
            website: result.data.website || '',
            price: result.data.price,
            nearest_station_ja: result.data.nearestStation.ja,
            nearest_station_en: result.data.nearestStation.en,
            access_time_ja: result.data.accessTime.ja,
            access_time_en: result.data.accessTime.en,
            description_ja: result.data.description.ja,
            description_en: result.data.description.en,
            facilities: result.data.facilities || [],
            activities: result.data.activities || []
          }
          setCampsite(formData)
        } else {
          setError(result.error || 'キャンプ場の取得に失敗しました')
        }
      } catch (err) {
        setError('ネットワークエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchCampsite()
  }, [params.id])

  const handleSubmit = async (data: CampsiteFormData) => {
    try {
      const response = await fetch(`/api/campsites/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/admin/campsites')
      } else {
        setError(result.error || '更新に失敗しました')
      }
    } catch (err) {
      setError('更新中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">読み込み中...</div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">キャンプ場編集</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!campsite) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">キャンプ場編集</h1>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            キャンプ場が見つかりません
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">キャンプ場編集</h1>
          <button
            onClick={() => router.push('/admin/campsites')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            一覧に戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <CampsiteForm
            initialData={campsite}
            onSubmit={handleSubmit}
            isEditMode={true}
            campsiteId={params.id}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
