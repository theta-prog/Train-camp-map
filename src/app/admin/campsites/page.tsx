'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { Campsite } from '@/types/campsite'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CampsitesListPage() {
  const [campsites, setCampsites] = useState<Campsite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCampsites()
  }, [])

  const fetchCampsites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/campsites')
      const result = await response.json()

      if (response.ok) {
        setCampsites(result.data || [])
      } else {
        setError(result.error || 'キャンプ場の取得に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このキャンプ場を削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/campsites/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCampsites(campsites.filter(campsite => campsite.id !== id))
      } else {
        const result = await response.json()
        setError(result.error || '削除に失敗しました')
      }
    } catch (err) {
      setError('削除中にエラーが発生しました')
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">キャンプ場一覧</h1>
          <Link
            href="/admin/campsites/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            新規登録
          </Link>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* キャンプ場一覧 */}
        {campsites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">キャンプ場が登録されていません</p>
            <Link
              href="/admin/campsites/new"
              className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
            >
              最初のキャンプ場を登録する
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {campsites.map((campsite) => (
                <li key={campsite.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {campsite.name.ja}
                            </h3>
                            {campsite.address.ja && (
                              <p className="text-sm text-gray-500">
                                {campsite.address.ja}
                              </p>
                            )}
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                              <span>緯度: {campsite.lat}</span>
                              <span>経度: {campsite.lng}</span>
                              {campsite.price && <span>{campsite.price}</span>}
                            </div>
                            {/* 設備とアクティビティのタグ表示 */}
                            {(campsite.facilities.length > 0 || campsite.activities.length > 0) && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {campsite.facilities.map((facility, index) => (
                                  <span key={`facility-${index}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {facility}
                                  </span>
                                ))}
                                {campsite.activities.map((activity, index) => (
                                  <span key={`activity-${index}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/campsites/${campsite.id}/edit` as any}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDelete(campsite.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
