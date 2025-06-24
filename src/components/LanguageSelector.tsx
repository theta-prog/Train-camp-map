'use client'

import { useTranslations } from 'next-intl'
import { useParams, usePathname, useRouter } from 'next/navigation'

export default function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const t = useTranslations()
  const locale = (params?.locale as 'ja' | 'en') || 'ja'

  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) return
    // 現在のパスから言語部分を置換
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath as any)
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        {t('navigation.language')}:
      </span>
      <div className="flex bg-gray-100 rounded-md overflow-hidden">
        <button
          onClick={() => handleLanguageChange('ja')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            locale === 'ja' 
              ? 'bg-green-600 text-white' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          日本語
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            locale === 'en' 
              ? 'bg-green-600 text-white' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          English
        </button>
      </div>
    </div>
  )
}
