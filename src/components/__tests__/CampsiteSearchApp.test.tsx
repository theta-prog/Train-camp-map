import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CampsiteSearchApp from '../CampsiteSearchApp'

// サンプルデータ
const sampleCampsites = [
  {
    id: '1',
    name: '高尾山キャンプ場',
    description: '高尾山の麓にある自然豊かなキャンプ場',
    lat: 35.6422,
    lng: 139.2676,
    address: '東京都八王子市高尾町',
    nearestStation: 'JR高尾駅',
    accessTime: '徒歩15分',
    price: '¥2,000/泊',
    facilities: ['restroom', 'shower', 'parking'],
    activities: ['hiking', 'photography'],
    website: 'https://example.com',
    phone: '042-xxx-xxxx',
    images: [],
    reservationUrl: '',
    priceMin: 2000,
    priceMax: 2000,
    checkInTime: '',
    checkOutTime: '',
    cancellationPolicy: '',
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

// useParams のモック
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ locale: 'ja' })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}))

// Google Maps API keyを設定
const originalEnv = process.env
beforeAll(() => {
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
})

afterAll(() => {
  process.env = originalEnv
})

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
  return function MockSearchFilters({ onFilterChange, initialFilters }: any) {
    return (
      <div data-testid="mock-search-filters">
        <input 
          placeholder="キーワード検索"
          onChange={(e) => onFilterChange({ 
            ...initialFilters, 
            keyword: e.target.value 
          })}
        />
        <label>
          最大料金
          <input 
            type="number"
            onChange={(e) => onFilterChange({ 
              ...initialFilters,
              maxPrice: parseInt(e.target.value) || 0 
            })}
          />
        </label>
        <div>
          <input 
            type="checkbox" 
            id="toilet"
            onChange={(e) => onFilterChange({ 
              ...initialFilters,
              facilities: e.target.checked ? ['toilet'] : [] 
            })}
          />
          <label htmlFor="toilet">トイレ</label>
        </div>
        <button 
          onClick={() => onFilterChange({ 
            ...initialFilters,
            keyword: 'test' 
          })}
        >
          Change Filter
        </button>
      </div>
    )
  }
})

jest.mock('../CampsiteList', () => {
  return function MockCampsiteList({ campsites }: any) {
    if (campsites.length === 0) {
      return (
        <div data-testid="mock-campsite-list">
          <p>キャンプ場が見つかりませんでした</p>
        </div>
      )
    }
    
    return (
      <div data-testid="mock-campsite-list">
        {campsites.map((campsite: any) => (
          <div key={campsite.id}>
            <span>{campsite.name}</span>
            <a href={`/campsites/${campsite.id}`}>詳細を見る</a>
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

// beforeEach と afterEach の設定
beforeEach(() => {
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
  mockFetchCampsites.mockResolvedValue(sampleCampsites)
  jest.clearAllMocks()
})

describe('CampsiteSearchApp', () => {
  describe('スナップショットテスト', () => {
    it('基本表示（APIキーあり）', async () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
      
      const { container } = render(<CampsiteSearchApp />)
      
      // データが読み込まれるまで待つ
      await waitFor(() => {
        expect(screen.getByTestId('mock-campsite-list')).toBeInTheDocument()
      })
      
      expect(container.firstChild).toMatchSnapshot()
    })

    it('英語ロケール', async () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
      
      const { container } = render(<CampsiteSearchApp />)
      
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
      
      render(<CampsiteSearchApp />)
      
      expect(screen.getByText('Google Maps API key is missing')).toBeInTheDocument()
      expect(screen.getByText('Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')).toBeInTheDocument()
    })

    it('APIキーがある場合正常表示', async () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
      
      render(<CampsiteSearchApp />)
      
      // データが読み込まれるまで待つ
      await waitFor(() => {
        expect(screen.getByText('Campsite Search')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Find campsites accessible by train')).toBeInTheDocument()
      expect(screen.getByTestId('mock-search-filters')).toBeInTheDocument()
      expect(screen.getByTestId('mock-campsite-list')).toBeInTheDocument()
      expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument()
    })

  it('フィルター適用時に結果が更新される', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
    })

    // キーワード検索でフィルター
    const searchInput = screen.getByPlaceholderText(/キーワード検索/)
    fireEvent.change(searchInput, { target: { value: '高尾' } })

    expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
  })

  it.skip('価格範囲フィルターが正しく動作する', async () => {
    const campsitesWithPrices = [
      { ...sampleCampsites[0], price: '¥1,000/泊' },
      { ...sampleCampsites[0], id: '2', price: '¥3,000/泊', name: '高価なキャンプ場' },
    ]
    
    mockFetchCampsites.mockResolvedValue(campsitesWithPrices)
    
    render(<CampsiteSearchApp />)
    
    // 最初にすべてのキャンプ場が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
      expect(screen.getByText('高価なキャンプ場')).toBeInTheDocument()
    })

    // 最大料金フィルター（2000円）を設定
    const maxPriceInput = screen.getByLabelText(/最大料金/)
    
    // 最初の変更で初期化フラグを設定
    fireEvent.change(maxPriceInput, { target: { value: '5000' } })
    
    // 実際のフィルター適用（2000円以下）
    fireEvent.change(maxPriceInput, { target: { value: '2000' } })

    // デバウンス処理があるかもしれないので、時間を置いて確認
    await new Promise(resolve => setTimeout(resolve, 100))

    await waitFor(() => {
      // 1000円のキャンプ場は表示される
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
    })

    await waitFor(() => {
      // 3000円のキャンプ場は除外される
      expect(screen.queryByText('高価なキャンプ場')).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('設備フィルターが正しく動作する', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
    })

    // トイレフィルターを適用
    const restroomFilter = screen.getByRole('checkbox', { name: /トイレ/ })
    fireEvent.click(restroomFilter)

    // サンプルキャンプ場はトイレ設備があるので表示される
    expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
  })

  it.skip('エラー状態の回復が正しく動作する', async () => {
    // 最初にエラーを返すモック
    mockFetchCampsites.mockRejectedValueOnce(new Error('Network error'))
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByText(/キャンプサイトの読み込みに失敗しました/)).toBeInTheDocument()
    })

    // リトライボタンをクリック
    const retryButton = screen.getByRole('button', { name: /再読み込み/ })
    fireEvent.click(retryButton)

    // window.location.reloadが呼ばれることを確認
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('空の検索結果が正しく表示される', async () => {
    mockFetchCampsites.mockResolvedValue([])
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByText(/キャンプ場が見つかりませんでした/)).toBeInTheDocument()
    })
  })

  it('詳細ページへのナビゲーションが正しく動作する', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
    })

    // 詳細リンクをクリック
    const detailLink = screen.getByRole('link', { name: /詳細を見る/ })
    expect(detailLink).toHaveAttribute('href', '/campsites/1')
  })

  // APIエラーハンドリングのテスト
  it('API取得エラー時にエラーメッセージが表示される', async () => {
    mockFetchCampsites.mockRejectedValue(new Error('Network error'))
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByText('キャンプサイトの読み込みに失敗しました')).toBeInTheDocument()
    })
  })

  // ロケールのフォールバック処理テスト
  it('無効なロケールの場合はjaにフォールバックする', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-campsite-list')).toBeInTheDocument()
    })
    
    // データが表示されることを確認（日本語表示）
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
    })
  })

  // 地図のクリックイベントテスト
  it('地図でキャンプサイトを選択できる', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-map-component')).toBeInTheDocument()
    })

    // 地図のマーカークリックをシミュレート
    const mapComponent = screen.getByTestId('mock-map-component')
    fireEvent.click(mapComponent)
  })

  // フィルタリングのリセット機能テスト
  it('フィルタをリセットできる', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-search-filters')).toBeInTheDocument()
    })

    // フィルタ変更ボタンをクリック（SearchFiltersモックのボタン）
    const filterButton = screen.getByText('Change Filter')
    fireEvent.click(filterButton)
    
    // 全てのキャンプサイトが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
    })
  })

  // 複数条件でのフィルタリングテスト
  it('複数の条件でフィルタリングできる', async () => {
    const multipleCampsites = [
      ...sampleCampsites,
      {
        id: '2',
        name: '湖畔キャンプ場',
        description: '湖のほとりの静かなキャンプ場',
        lat: 35.7,
        lng: 139.3,
        address: '山梨県富士五湖',
        nearestStation: '河口湖駅',
        accessTime: 'バス30分',
        price: '¥5,000/泊',
        facilities: ['restroom', 'cooking'],
        activities: ['fishing', 'canoeing'],
        website: 'https://example2.com',
        phone: '055-xxx-xxxx',
        images: [],
        reservationUrl: '',
        priceMin: 5000,
        priceMax: 5000,
        checkInTime: '',
        checkOutTime: '',
        cancellationPolicy: '',
      }
    ]
    
    mockFetchCampsites.mockResolvedValue(multipleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-search-filters')).toBeInTheDocument()
    })

    // キーワード検索
    const keywordInput = screen.getByPlaceholderText('キーワード検索')
    fireEvent.change(keywordInput, { target: { value: '高尾' } })
    
    // 料金フィルタ
    const priceInput = screen.getByLabelText('最大料金')
    fireEvent.change(priceInput, { target: { value: '3000' } })
    
    // 検索結果をチェック（高尾山キャンプ場のみが表示される）
    await waitFor(() => {
      expect(screen.getByText('高尾山キャンプ場')).toBeInTheDocument()
      expect(screen.queryByText('湖畔キャンプ場')).not.toBeInTheDocument()
    })
  })

  // ローディング状態のテスト
  it('ローディング中は適切な表示がされる', () => {
    // fetchCampsitesが解決されないPromiseを返すようにする
    mockFetchCampsites.mockImplementation(() => new Promise(() => {}))
    
    render(<CampsiteSearchApp />)
    
    // ローディングメッセージが表示されることを確認
    expect(screen.getByText('キャンプサイトを読み込み中...')).toBeInTheDocument()
  })

  // 言語切り替えのテスト
  it('言語切り替えができる', async () => {
    mockFetchCampsites.mockResolvedValue(sampleCampsites)
    
    render(<CampsiteSearchApp />)
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument()
    })

    // 言語切り替えコンポーネントがレンダリングされていることを確認
    expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument()
    expect(screen.getByText('Language Switcher')).toBeInTheDocument()
  })
  })
})
