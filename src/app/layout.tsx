import '@/styles/globals.css'

export const metadata = {
  title: 'Train Camp App',
  description: 'キャンプ場検索・管理アプリケーション',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
