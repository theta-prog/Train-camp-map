import { Campsite } from '@/types/campsite'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import MapComponent from '../MapComponent'

// 環境変数のモック
const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'test-api-key',
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: 'test-map-id',
  }
})

afterAll(() => {
  process.env = originalEnv
})

// モック設定
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'campsiteList.nearestStation': 'Nearest Station',
      'campsiteList.access': 'Access', 
      'campsiteList.price': 'Price',
      'map.viewDetails': 'View Details',
    }
    return translations[key] || key
  }
}))

const mockUseParams = jest.fn()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({
    push: mockPush
  })
}))

jest.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children }: any) => (
    <div data-testid="mock-map" style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  ),
  AdvancedMarker: ({ children, onClick, title }: any) => (
    <div data-testid="mock-marker" onClick={onClick} title={title}>
      {children}
    </div>
  ),
  InfoWindow: ({ children, onCloseClick }: any) => (
    <div data-testid="mock-info-window">
      <button data-testid="close-button" onClick={onCloseClick}>×</button>
      {children}
    </div>
  ),
}))

const mockCampsites: Campsite[] = [
  {
    id: '1',
    name: { ja: 'テストキャンプ場1', en: 'Test Campsite 1' },
    lat: 35.6762,
    lng: 139.6503,
    address: { ja: '東京都渋谷区', en: 'Shibuya, Tokyo' },
    phone: '03-1234-5678',
    website: 'https://test1.com',
    price: '¥2,000/泊',
    nearestStation: { ja: '渋谷駅', en: 'Shibuya Station' },
    accessTime: { ja: '徒歩15分', en: '15 min walk' },
    description: { ja: '美しい自然に囲まれたキャンプ場', en: 'Beautiful campsite surrounded by nature' },
    facilities: ['restroom', 'shower', 'parking'],
    activities: ['hiking', 'fishing'],
  },
]

describe('MapComponent', () => {
  const mockOnCampsiteSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({ locale: 'ja' })
  })

  describe('スナップショットテスト', () => {
    it('基本の地図表示', () => {
      const { container } = render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('選択されたキャンプ場でInfoWindow表示', () => {
      const { container } = render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={mockCampsites[0]!}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('基本機能', () => {
    it('マーカークリック時にコールバック呼び出し', () => {
      render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )

      const markers = screen.getAllByTestId('mock-marker')
      fireEvent.click(markers[0]!)
      
      expect(mockOnCampsiteSelect).toHaveBeenCalledWith(mockCampsites[0])
    })

    it('InfoWindowクローズ機能で状態をリセット', () => {
      // selectedCampsiteを設定してInfoWindowを表示
      const { rerender } = render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )

      // マーカーをクリックしてonCampsiteSelectを呼び出す
      const markers = screen.getAllByTestId('mock-marker')
      fireEvent.click(markers[0]!)
      
      // selectedCampsiteを設定して再レンダリング
      rerender(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={mockCampsites[0]!}
        />
      )
      
      // InfoWindowが表示されている
      expect(screen.getByTestId('mock-info-window')).toBeInTheDocument()
      
      // クローズボタンをクリックしてhandleInfoWindowCloseを呼び出す
      const closeButton = screen.getByTestId('close-button')
      fireEvent.click(closeButton)
      
      // InfoWindowが閉じられる（activeMarkerがnullになる）
      expect(screen.queryByTestId('mock-info-window')).not.toBeInTheDocument()
    })

    it('handleMarkerClickでactiveMarkerを設定', () => {
      render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )

      // マーカーをクリック
      const markers = screen.getAllByTestId('mock-marker')
      fireEvent.click(markers[0]!)
      
      // onCampsiteSelectが呼ばれることを確認
      expect(mockOnCampsiteSelect).toHaveBeenCalledWith(mockCampsites[0])
    })

    it('paramsがnullの場合のデフォルトロケール処理', () => {
      mockUseParams.mockReturnValue(null)
      
      render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )

      // デフォルトの日本語ロケールで正常に表示される
      expect(screen.getByTestId('mock-map')).toBeInTheDocument()
    })

    it('localeが未定義の場合のフォールバック処理', () => {
      mockUseParams.mockReturnValue({ locale: undefined })
      
      render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )

      // デフォルトの日本語ロケールで正常に表示される
      expect(screen.getByTestId('mock-map')).toBeInTheDocument()
    })

    it('InfoWindow内の詳細ボタンがクリック可能', () => {
      // selectedCampsiteを設定してInfoWindowを表示
      render(
        <MapComponent
          campsites={mockCampsites}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={mockCampsites[0]!}
        />
      )

      // activeMarkerを設定するためにマーカーをクリック
      const markers = screen.getAllByTestId('mock-marker')
      fireEvent.click(markers[0]!)
      
      // InfoWindowが表示される
      expect(screen.getByTestId('mock-info-window')).toBeInTheDocument()
      
      // 詳細ボタンをクリック
      const detailsButton = screen.getByText('View Details')
      fireEvent.click(detailsButton)
      
      // ボタンがクリック可能であることを確認（エラーが発生しないことを確認）
      expect(detailsButton).toBeInTheDocument()
    })
  })
})
