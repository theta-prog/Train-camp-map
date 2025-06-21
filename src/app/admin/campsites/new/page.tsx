'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import CampsiteForm from '@/components/admin/CampsiteForm'
import { CampsiteFormData } from '@/lib/validations/campsite'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewCampsitePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新規キャンプ場登録</h1>
          <p className="mt-1 text-gray-600">
            新しいキャンプ場の情報を入力してください
          </p>
        </div>

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
        />
      </div>
    </AdminLayout>
  )
}
