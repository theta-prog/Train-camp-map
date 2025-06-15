'use client'

import { useState, useCallback } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import SearchFilters from '@/components/SearchFilters'
import CampsiteList from '@/components/CampsiteList'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Campsite } from '@/types/campsite'

// MapComponentを動的インポートしてSSRを無効化
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ width: '100%', height: '600px' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

// 多言語対応のサンプルキャンプ場データ
const sampleCampsites: Campsite[] = [
  {
    id: '1',
    name: {
      ja: '高尾山キャンプ場',
      en: 'Mount Takao Campsite'
    },
    lat: 35.625,
    lng: 139.244,
    address: {
      ja: '東京都八王子市高尾町',
      en: 'Takao-machi, Hachioji, Tokyo'
    },
    phone: '042-661-0037',
    website: 'https://example.com',
    price: '3000円〜 / ¥3,000~',
    facilities: ['toilet', 'shower', 'kitchen'],
    activities: ['hiking', 'bbq'],
    nearestStation: {
      ja: 'JR高尾駅',
      en: 'JR Takao Station'
    },
    accessTime: {
      ja: '徒歩15分',
      en: '15 min walk'
    },
    description: {
      ja: '高尾山の麓にある自然豊かなキャンプ場です。',
      en: 'A nature-rich campsite at the foot of Mount Takao.'
    }
  },
  {
    id: '2',
    name: {
      ja: '奥多摩湖キャンプ場',
      en: 'Lake Okutama Campsite'
    },
    lat: 35.781,
    lng: 139.017,
    address: {
      ja: '東京都西多摩郡奥多摩町',
      en: 'Okutama-machi, Nishitama District, Tokyo'
    },
    phone: '0428-83-2152',
    website: 'https://example.com',
    price: '2500円〜 / ¥2,500~',
    facilities: ['toilet', 'kitchen', 'shop'],
    activities: ['fishing', 'canoe', 'hiking'],
    nearestStation: {
      ja: 'JR奥多摩駅',
      en: 'JR Okutama Station'
    },
    accessTime: {
      ja: 'バス20分',
      en: '20 min by bus'
    },
    description: {
      ja: '奥多摩湖のほとりにある湖畔キャンプ場です。',
      en: 'A lakeside campsite by Lake Okutama.'
    }
  },
  {
    id: '3',
    name: {
      ja: '河口湖オートキャンプ場',
      en: 'Lake Kawaguchi Auto Campsite'
    },
    lat: 35.509,
    lng: 138.764,
    address: {
      ja: '山梨県南都留郡富士河口湖町',
      en: 'Fujikawaguchiko-machi, Minamitsuru District, Yamanashi'
    },
    phone: '0555-72-4145',
    website: 'https://example.com',
    price: '4000円〜 / ¥4,000~',
    facilities: ['toilet', 'shower', 'kitchen', 'rental', 'parking'],
    activities: ['fishing', 'bbq', 'stargazing'],
    nearestStation: {
      ja: 'JR河口湖駅',
      en: 'JR Kawaguchi-ko Station'
    },
    accessTime: {
      ja: 'バス15分',
      en: '15 min by bus'
    },
    description: {
      ja: '富士山を望む絶景のキャンプ場。河口湖でのアクティビティも楽しめます。',
      en: 'A scenic campsite with views of Mount Fuji. Enjoy activities at Lake Kawaguchi.'
    }
  },
  {
    id: '4',
    name: {
      ja: '丹沢湖キャンプリゾート',
      en: 'Lake Tanzawa Camp Resort'
    },
    lat: 35.454,
    lng: 138.952,
    address: {
      ja: '神奈川県足柄上郡山北町',
      en: 'Yamakita-machi, Ashigarakami District, Kanagawa'
    },
    phone: '0465-78-3181',
    website: 'https://example.com',
    price: '3500円〜 / ¥3,500~',
    facilities: ['toilet', 'shower', 'kitchen', 'shop', 'wifi'],
    activities: ['hiking', 'fishing', 'canoe', 'river'],
    nearestStation: {
      ja: 'JR谷峨駅',
      en: 'JR Yaga Station'
    },
    accessTime: {
      ja: 'バス25分',
      en: '25 min by bus'
    },
    description: {
      ja: '丹沢湖畔の美しい自然に囲まれたキャンプ場。カヌーや釣りが人気です。',
      en: 'A beautiful campsite surrounded by nature at Lake Tanzawa. Canoeing and fishing are popular.'
    }
  },
  {
    id: '5',
    name: {
      ja: '箱根芦ノ湖キャンプ村',
      en: 'Hakone Lake Ashi Camp Village'
    },
    lat: 35.205,
    lng: 139.026,
    address: {
      ja: '神奈川県足柄下郡箱根町',
      en: 'Hakone-machi, Ashigarashimo District, Kanagawa'
    },
    phone: '0460-84-8279',
    website: 'https://example.com',
    price: '5000円〜 / ¥5,000~',
    facilities: ['toilet', 'shower', 'kitchen', 'rental', 'shop', 'parking'],
    activities: ['hiking', 'bbq', 'boat'],
    nearestStation: {
      ja: 'JR小田原駅',
      en: 'JR Odawara Station'
    },
    accessTime: {
      ja: 'バス45分',
      en: '45 min by bus'
    },
    description: {
      ja: '芦ノ湖の雄大な景色を楽しめる高級キャンプ場。温泉も近くにあります。',
      en: 'A premium campsite with magnificent views of Lake Ashi. Hot springs are nearby.'
    }
  }
]

interface CampsiteSearchAppProps {
  locale: string
}

export default function CampsiteSearchApp({ locale }: CampsiteSearchAppProps) {
  const t = useTranslations()
  const [selectedCampsite, setSelectedCampsite] = useState<Campsite | null>(null)
  const [filteredCampsites, setFilteredCampsites] = useState<Campsite[]>(sampleCampsites)
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    maxPrice: 10000,
    facilities: [] as string[],
    activities: [] as string[]
  })
  const [isFiltersInitialized, setIsFiltersInitialized] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const handleFilterChange = useCallback((filters: typeof searchFilters) => {
    setSearchFilters(filters)
    
    if (!isFiltersInitialized) {
      setIsFiltersInitialized(true)
      setFilteredCampsites(sampleCampsites)
      return
    }
    
    let filtered = sampleCampsites.filter(campsite => {
      const currentLocale = locale as 'ja' | 'en' || 'ja'
      
      const keywordLower = filters.keyword.toLowerCase()
      const keywordMatch = !filters.keyword || 
        campsite.name[currentLocale].toLowerCase().includes(keywordLower) ||
        campsite.address[currentLocale].toLowerCase().includes(keywordLower) ||
        campsite.nearestStation[currentLocale].toLowerCase().includes(keywordLower)
      
      const priceMatch = campsite.price.match(/\d+/)
      const priceValue = priceMatch ? parseInt(priceMatch[0]) : 0
      const priceWithinLimit = priceValue <= filters.maxPrice
      
      const facilitiesMatch = filters.facilities.length === 0 || 
        filters.facilities.some((facility: string) => campsite.facilities.includes(facility))
      
      const activitiesMatch = filters.activities.length === 0 || 
        filters.activities.some((activity: string) => campsite.activities.includes(activity))
      
      return keywordMatch && priceWithinLimit && facilitiesMatch && activitiesMatch
    })
    
    setFilteredCampsites(filtered)
  }, [locale, isFiltersInitialized])

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">{t('map.apiKeyMissing')}</p>
          <p className="text-sm text-gray-500">
            {t('map.apiKeyInstruction')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  {t('title')}
                </h1>
                <p className="text-green-100">
                  {t('subtitle')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters 
                onFilterChange={handleFilterChange}
                initialFilters={searchFilters}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <MapComponent 
                  campsites={filteredCampsites}
                  onCampsiteSelect={setSelectedCampsite}
                  selectedCampsite={selectedCampsite}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <CampsiteList 
                campsites={filteredCampsites}
                onCampsiteSelect={setSelectedCampsite}
                selectedCampsite={selectedCampsite}
              />
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  )
}
