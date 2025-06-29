'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CsvImportResult {
  success: number
  errors: Array<{ row: number; message: string }>
}

export default function CsvImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CsvImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('CSVファイルを選択してください')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      setError('ファイルを選択してください')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('csv', file)

      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'インポートに失敗しました')
      }

      const result = await response.json()
      setResult(result)
      
      if (result.success > 0) {
        setTimeout(() => {
          router.push('/admin/campsites')
        }, 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      'name_ja,name_en,address_ja,address_en,lat,lng,price,nearest_station_ja,nearest_station_en,access_time_ja,access_time_en,description_ja,description_en,amenities,activities',
      '山田キャンプ場,Yamada Campground,長野県安曇野市,Azumino Nagano,36.3,137.9,3000,安曇追分駅,Azumi-Oiwake Station,車で15分,15 min by car,自然豊かなキャンプ場,Nature-rich campground,"toilets,showers,parking","hiking,fishing"'
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'campsite_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CSVインポート</h2>
        <p className="mt-1 text-gray-600">
          CSVファイルを使用してキャンプ場データを一括登録できます
        </p>
      </div>

      {/* テンプレートダウンロード */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              CSVテンプレートをダウンロードして、正しい形式でデータを準備してください
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <button
                onClick={downloadTemplate}
                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
              >
                テンプレートダウンロード
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ファイルアップロード */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700">
            CSVファイル
          </label>
          <div className="mt-1">
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              選択されたファイル: {file.name}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/admin/campsites')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!file || loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'インポート中...' : 'インポート実行'}
          </button>
        </div>
      </form>

      {/* エラー表示 */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">エラー</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {result && (
        <div className={`rounded-md p-4 ${result.errors.length > 0 ? 'bg-yellow-50' : 'bg-green-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${result.errors.length > 0 ? 'text-yellow-400' : 'text-green-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${result.errors.length > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                インポート完了
              </h3>
              <div className={`mt-2 text-sm ${result.errors.length > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                <p>成功: {result.success}件</p>
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p>エラー: {result.errors.length}件</p>
                    <ul className="mt-1 list-disc list-inside">
                      {result.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>行 {error.row}: {error.message}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>他 {result.errors.length - 5}件のエラー</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
