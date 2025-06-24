import Link from 'next/link'
import { ReactNode } from 'react'
import AuthGuard from './AuthGuard'
import GoogleMapsProvider from './GoogleMapsProvider'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* ナビゲーションヘッダー */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900">
                  キャンプ場管理システム
                </Link>
              </div>
              <nav className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ダッシュボード
                </Link>
                <Link
                  href="/admin/campsites"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  キャンプ場一覧
                </Link>
                <Link
                  href="/admin/campsites/new"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  新規登録
                </Link>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  サイトに戻る
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GoogleMapsProvider>
            {children}
          </GoogleMapsProvider>
        </main>
      </div>
    </AuthGuard>
  )
}
