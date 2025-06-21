import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import CampsiteSearchApp from '../CampsiteSearchApp'

// サンプルデータ
const sampleCampsites = [
  {
    id: '1',
    name: { ja: '高尾山キャンプ場', en: 'Takao Mountain Campsite' },
    description: { ja: '高尾山の麓にある自然豊かなキャンプ場', en: 'A nature-rich campsite at the foot of Mount Takao' },
    location: { lat: 35.6422, lng: 139.2676 },
    address: { ja: '東京都八王子市高尾町', en: 'Takao, Hachioji City, Tokyo' },
    nearestStation: { ja: 'JR高尾駅', en: 'JR Takao Station' },
    accessTime: { ja: '徒歩15分', en: '15 min walk' },
    price: '¥2,000/泊',
    facilities: ['restroom', 'shower', 'parking'],
    activities: ['hiking', 'photography'],
    website: 'https://example.com',
    phone: '042-xxx-xxxx'
  }
]

// モック next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Campsite Search',
      'subtitle': 'Find campsites accessible by train',
      'map.apiKeyMissing': 'Google Maps API key is missing',
      'map.apiKeyInstruction': 'Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    }
    return translations[key] || key
  }
}))

// API関数のモック
jest.mock('@/utils/campsiteApi', () => ({
  fetchCampsites: jest.fn(),
  extractPriceFromString: jest.fn((price: string) => {
    const match = price.match(/\d+/)
    return match ? parseInt(match[0]) : 0
  }),
  transformApiCampsiteToFrontend: jest.fn()
}))

// モック関数を取得
const { fetchCampsites } = require('@/utils/campsiteApi')
const mockFetchCampsites = fetchCampsites as jest.MockedFunction<typeof fetchCampsites>

// モック Google Maps API
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: any) => <div data-testid="api-provider">{children}</div>,
}))

// モック dynamic import
jest.mock('next/dynamic', () => {
  return function mockDynamic(_importFunc: any, options?: any) {
    const MockedComponent = (_props: any) => (
      <div data-testid="mock-map-component">
        {options?.loading && options.loading()}
      </div>
    )
    return MockedComponent
  }
})

// 子コンポーネントのモック
jest.mock('../SearchFilters', () => {
  return function MockSearchFilters({ onFilterChange }: any) {
    return (
      <div data-testid="mock-search-filters">
        <button 
          onClick={() => onFilterChange({ keyword: 'test', maxPrice: 5000, facilities: [], activities: [] })}
        >
          Change Filter
        </button>
      </div>
    )
  }
})

jest.mock('../CampsiteList', () => {
  return function MockCampsiteList({ campsites }: any) {
    return (
      <div data-testid="mock-campsite-list">
        {campsites.map((campsite: any) => (
          <div key={campsite.id}>
            {campsite.name.ja}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('../LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="mock-language-switcher">Language Switcher</div>
  }
})

// 環境変数のモック
const originalEnv = process.env
beforeEach(() => {
  process.env = { ...originalEnv }
  mockFetchCampsites.mockResolvedValue(sampleCampsites)
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

describe('CampsiteSearchApp', () => {
  describe('スナップショットテスト', () => {
    it('基本表示（APIキーあり）', async () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
      
      const { container } = render(<CampsiteSearchApp locale="ja" />)
      
      // データが読み込まれるまで待つ
      await waitFor(() => {
        expect(screen.getByTestId('mock-campsite-list')).toBeInTheDocument()
      })
      
      expect(container.firstChild).toMatchSnapshot()
    })

    it('英語ロケール', async () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
      
      const { container } = render(<CampsiteSearchApp locale="en" />)
      
      // データが読み込まれるまで待つ
      await waitFor(() => {
        expect(screen.getByTestId('mock-campsite-list')).toBeInTheDocument()
      })
      
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('基本機能', () => {
    it('APIキーがない場合エラーメッセージ表示', () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      render(<CampsiteSearchApp locale="ja" />)
      
      expect(screen.getByText('Google Maps API key is missing')).toBeInTheDocument()
      expect(screen.getByText('Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')).toBeInTheDocument()
    })

    it('APIキーがある場合正常表示', async () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
      
      render(<CampsiteSearchApp locale="ja" />)
      
      // データが読み込まれるまで待つ
      await waitFor(() => {
        expect(screen.getByText('Campsite Search')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Find campsites accessible by train')).toBeInTheDocument()
      expect(screen.getByTestId('mock-search-filters')).toBeInTheDocument()
      expect(screen.getByTestId('mock-campsite-list')).toBeInTheDocument()
      expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument()
    })
  })
})
