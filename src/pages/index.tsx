import { useState, useCallback } from 'react'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { APIProvider } from '@vis.gl/react-google-maps'
import MapComponent from '@/components/MapComponent'
import SearchFilters from '@/components/SearchFilters'
import CampsiteList from '@/components/CampsiteList'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Campsite } from '@/types/campsite'
import { useRouter } from 'next/router'

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
      ja: '相模湖キャンプ場',
      en: 'Lake Sagami Campsite'
    },
    lat: 35.609,
    lng: 139.249,
    address: {
      ja: '神奈川県相模原市緑区',
      en: 'Midori Ward, Sagamihara, Kanagawa'
    },
    phone: '042-784-0250',
    website: 'https://example.com',
    price: '3500円〜 / ¥3,500~',
    facilities: ['toilet', 'shower', 'kitchen', 'rental'],
    activities: ['boat', 'fishing', 'bbq'],
    nearestStation: {
      ja: 'JR相模湖駅',
      en: 'JR Lake Sagami Station'
    },
    accessTime: {
      ja: '徒歩10分',
      en: '10 min walk'
    },
    description: {
      ja: '相模湖畔の景色を楽しめるキャンプ場です。',
      en: 'A campsite where you can enjoy the scenic view of Lake Sagami.'
    }
  },
  {
    id: '4',
    name: {
      ja: '丹沢湖キャンプ場',
      en: 'Lake Tanzawa Campsite'
    },
    lat: 35.457,
    lng: 139.017,
    address: {
      ja: '神奈川県足柄上郡山北町',
      en: 'Yamakita, Ashigarakami District, Kanagawa'
    },
    phone: '0465-78-3415',
    website: 'https://example.com',
    price: '4000円〜 / ¥4,000~',
    facilities: ['toilet', 'shower', 'kitchen', 'parking', 'wifi'],
    activities: ['hiking', 'fishing', 'canoe', 'stargazing'],
    nearestStation: {
      ja: 'JR谷峨駅',
      en: 'JR Yaga Station'
    },
    accessTime: {
      ja: 'バス30分',
      en: '30 min by bus'
    },
    description: {
      ja: '丹沢の山々に囲まれた美しい湖畔のキャンプ場です。',
      en: 'A beautiful lakeside campsite surrounded by the Tanzawa mountains.'
    }
  },
  {
    id: '5',
    name: {
      ja: '秋川渓谷キャンプ場',
      en: 'Akigawa Valley Campsite'
    },
    lat: 35.726,
    lng: 139.218,
    address: {
      ja: '東京都あきる野市',
      en: 'Akiruno City, Tokyo'
    },
    phone: '042-596-2831',
    website: 'https://example.com',
    price: '2800円〜 / ¥2,800~',
    facilities: ['toilet', 'kitchen', 'shop', 'rental'],
    activities: ['river', 'bbq', 'hiking'],
    nearestStation: {
      ja: 'JR武蔵五日市駅',
      en: 'JR Musashi-Itsukaichi Station'
    },
    accessTime: {
      ja: 'バス15分',
      en: '15 min by bus'
    },
    description: {
      ja: '清流秋川で川遊びが楽しめるファミリー向けキャンプ場です。',
      en: 'A family-friendly campsite where you can enjoy playing in the clear Akigawa River.'
    }
  },
  {
    id: '6',
    name: {
      ja: '檜原湖キャンプ場',
      en: 'Lake Hibara Campsite'
    },
    lat: 37.657,
    lng: 140.074,
    address: {
      ja: '福島県耶麻郡北塩原村',
      en: 'Kitashiobara, Yama District, Fukushima'
    },
    phone: '0241-32-2349',
    website: 'https://example.com',
    price: '3200円〜 / ¥3,200~',
    facilities: ['toilet', 'shower', 'kitchen', 'wifi'],
    activities: ['fishing', 'boat', 'hiking', 'stargazing'],
    nearestStation: {
      ja: 'JR猪苗代駅',
      en: 'JR Inawashiro Station'
    },
    accessTime: {
      ja: 'バス40分',
      en: '40 min by bus'
    },
    description: {
      ja: '裏磐梯の美しい自然に囲まれた湖畔キャンプ場です。',
      en: 'A lakeside campsite surrounded by the beautiful nature of Urabandai.'
    }
  },
  {
    id: '7',
    name: {
      ja: '中禅寺湖キャンプ場',
      en: 'Lake Chuzenji Campsite'
    },
    lat: 36.717,
    lng: 139.489,
    address: {
      ja: '栃木県日光市',
      en: 'Nikko City, Tochigi'
    },
    phone: '0288-55-0880',
    website: 'https://example.com',
    price: '3800円〜 / ¥3,800~',
    facilities: ['toilet', 'shower', 'kitchen', 'parking'],
    activities: ['fishing', 'boat', 'hiking'],
    nearestStation: {
      ja: 'JR日光駅',
      en: 'JR Nikko Station'
    },
    accessTime: {
      ja: 'バス50分',
      en: '50 min by bus'
    },
    description: {
      ja: '日光の中禅寺湖畔にある歴史ある景勝地のキャンプ場です。',
      en: 'A campsite at the historic scenic spot on the shore of Lake Chuzenji in Nikko.'
    }
  },
  {
    id: '8',
    name: {
      ja: '箱根芦ノ湖キャンプ場',
      en: 'Lake Ashi Hakone Campsite'
    },
    lat: 35.194,
    lng: 139.025,
    address: {
      ja: '神奈川県足柄下郡箱根町',
      en: 'Hakone, Ashigarashimo District, Kanagawa'
    },
    phone: '0460-84-8279',
    website: 'https://example.com',
    price: '4500円〜 / ¥4,500~',
    facilities: ['toilet', 'shower', 'kitchen', 'rental', 'shop'],
    activities: ['boat', 'fishing', 'hiking'],
    nearestStation: {
      ja: 'JR小田原駅',
      en: 'JR Odawara Station'
    },
    accessTime: {
      ja: 'バス60分',
      en: '60 min by bus'
    },
    description: {
      ja: '富士山を望む芦ノ湖畔の高級リゾートキャンプ場です。',
      en: 'A luxury resort campsite on the shores of Lake Ashi with views of Mount Fuji.'
    }
  }
]

export default function HomePage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [selectedCampsite, setSelectedCampsite] = useState<Campsite | null>(null)
  const [filteredCampsites, setFilteredCampsites] = useState<Campsite[]>(sampleCampsites)
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    maxPrice: 10000,
    facilities: [] as string[],
    activities: [] as string[]
  })

  // 初期状態で全てのキャンプ場を表示
  const [isFiltersInitialized, setIsFiltersInitialized] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const handleFilterChange = useCallback((filters: typeof searchFilters) => {
    setSearchFilters(filters)
    
    // 初回の呼び出しをスキップ
    if (!isFiltersInitialized) {
      setIsFiltersInitialized(true)
      setFilteredCampsites(sampleCampsites)
      return
    }
    
    let filtered = sampleCampsites.filter(campsite => {
      const locale = (router.locale as 'ja' | 'en') || 'ja'
      
      // キーワード検索（空の場合は全て通す）
      const keywordLower = filters.keyword.toLowerCase()
      const keywordMatch = !filters.keyword || 
        campsite.name[locale].toLowerCase().includes(keywordLower) ||
        campsite.address[locale].toLowerCase().includes(keywordLower) ||
        campsite.nearestStation[locale].toLowerCase().includes(keywordLower)
      
      // 価格フィルター - 最初の数字のみを抽出
      const priceMatch = campsite.price.match(/\d+/)
      const priceValue = priceMatch ? parseInt(priceMatch[0]) : 0
      const priceWithinLimit = priceValue <= filters.maxPrice
      
      // 設備フィルター（空の場合は全て通す）
      const facilitiesMatch = filters.facilities.length === 0 || 
        filters.facilities.some(facility => campsite.facilities.includes(facility))
      
      // アクティビティフィルター（空の場合は全て通す）
      const activitiesMatch = filters.activities.length === 0 || 
        filters.activities.some(activity => campsite.activities.includes(activity))
      
      return keywordMatch && priceWithinLimit && facilitiesMatch && activitiesMatch
    })
    
    setFilteredCampsites(filtered)
  }, [router.locale, isFiltersInitialized])

  if (!apiKey) {
    return (
      <>
        <Head>
          <title>{t('title')}</title>
          <meta name="description" content={t('subtitle')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{t('map.apiKeyMissing')}</p>
            <p className="text-sm text-gray-500">
              {t('map.apiKeyInstruction')}
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-green-100">{t('subtitle')}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 検索フィルター */}
            <div className="lg:col-span-1">
              <SearchFilters 
                onFilterChange={handleFilterChange}
                initialFilters={searchFilters}
              />
            </div>

            {/* 地図 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <MapComponent 
                  campsites={filteredCampsites}
                  onCampsiteSelect={setSelectedCampsite}
                  selectedCampsite={selectedCampsite}
                />
              </div>
            </div>

            {/* キャンプ場リスト */}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ja', ['common'])),
    },
  }
}
