'use client'

import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

export default function LanguageSwitcher() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale })
    setIsOpen(false)
  }

  const currentLanguage = router.locale === 'en' ? 'English' : '日本語'
  const currentFlag = router.locale === 'en' ? '🇺🇸' : '🇯🇵'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
      >
        <span className="text-lg">{currentFlag}</span>
        <span className="font-medium">{currentLanguage}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange('ja')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                router.locale === 'ja' ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">🇯🇵</span>
              <span className="font-medium">日本語</span>
              {router.locale === 'ja' && (
                <svg className="w-4 h-4 ml-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                router.locale === 'en' ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">🇺🇸</span>
              <span className="font-medium">English</span>
              {router.locale === 'en' && (
                <svg className="w-4 h-4 ml-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
