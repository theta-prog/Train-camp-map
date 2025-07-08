import { Campsite } from '@/types/campsite'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import MapAddComponent from '../MapAddComponent'

// Google Maps APIのモック
jest.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children, onClick }: any) => (
    <div 
      data-testid="mock-map" 
      onClick={() => {
        if (onClick) {
          // マップクリックイベントをシミュレート
          onClick({
            detail: {
              latLng: { lat: 35.6762, lng: 139.6503 }
            }
          })
        }
      }}
    >
      {children}
    </div>
  ),
  AdvancedMarker: ({ children, position }: any) => (
    <div 
      data-testid="mock-marker" 
      data-lat={position?.lat}
      data-lng={position?.lng}
    >
      {children}
    </div>
  ),
}))

const mockExistingCampsites: Campsite[] = [
  {
    id: '1',
    name: { ja: '既存キャンプ場', en: 'Existing Campsite' },
    description: { ja: '説明', en: 'Description' },
    lat: 35.6,
    lng: 139.6,
    address: { ja: '東京都', en: 'Tokyo' },
    nearestStation: { ja: 'JR駅', en: 'JR Station' },
    accessTime: { ja: '徒歩10分', en: '10 min walk' },
    price: '¥2,000/泊',
    facilities: ['restroom'],
    activities: ['hiking'],
    website: 'https://example.com',
    phone: '03-1234-5678'
  }
]

describe('MapAddComponent', () => {
  const mockOnLocationSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={{ lat: 35.6762, lng: 139.6503 }}
        existingCampsites={mockExistingCampsites}
      />
    )

    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })

  it('マップクリック時にonLocationSelectが呼ばれる', () => {
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={null}
        existingCampsites={mockExistingCampsites}
      />
    )

    const map = screen.getByTestId('mock-map')
    fireEvent.click(map)

    expect(mockOnLocationSelect).toHaveBeenCalledWith(35.6762, 139.6503)
  })

  it('選択された位置にマーカーが表示される', () => {
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={{ lat: 35.6762, lng: 139.6503 }}
        existingCampsites={mockExistingCampsites}
      />
    )

    const markers = screen.getAllByTestId('mock-marker')
    const selectedMarker = markers.find(marker => 
      marker.getAttribute('data-lat') === '35.6762' && 
      marker.getAttribute('data-lng') === '139.6503'
    )
    expect(selectedMarker).toBeTruthy()
  })

  it('既存のキャンプ場マーカーが表示される', () => {
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={null}
        existingCampsites={mockExistingCampsites}
      />
    )

    const markers = screen.getAllByTestId('mock-marker')
    // 既存キャンプ場のマーカーが含まれている
    expect(markers.length).toBeGreaterThanOrEqual(1)
  })

  it('selectedLocationがnullの場合でもクラッシュしない', () => {
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={null}
        existingCampsites={mockExistingCampsites}
      />
    )

    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })

  it('位置が選択された時に情報が表示される', () => {
    const selectedLocation = { lat: 35.6762, lng: 139.6503 }
    
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={selectedLocation}
        existingCampsites={mockExistingCampsites}
      />
    )

    expect(screen.getByText('位置が選択されました')).toBeInTheDocument()
    expect(screen.getByText('緯度: 35.676200')).toBeInTheDocument()
    expect(screen.getByText('経度: 139.650300')).toBeInTheDocument()
  })

  it('現在位置を取得ボタンが表示される', () => {
    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={null}
        existingCampsites={mockExistingCampsites}
      />
    )

    expect(screen.getByText('現在位置を取得')).toBeInTheDocument()
  })

  describe('現在位置取得', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
    }

    beforeEach(() => {
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
      })
    })

    afterEach(() => {
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      })
    })

    it('現在位置取得に成功した場合', () => {
      const mockPosition = {
        coords: {
          latitude: 35.6581,
          longitude: 139.7414,
        }
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition)
      })

      render(
        <MapAddComponent
          onLocationSelect={mockOnLocationSelect}
          selectedLocation={null}
          existingCampsites={mockExistingCampsites}
        />
      )

      const getCurrentLocationButton = screen.getByText('現在位置を取得')
      fireEvent.click(getCurrentLocationButton)

      expect(mockOnLocationSelect).toHaveBeenCalledWith(35.6581, 139.7414)
    })

    it('現在位置取得に失敗した場合', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      const mockError = new Error('位置情報取得エラー')
      mockGeolocation.getCurrentPosition.mockImplementation((_success, error) => {
        error(mockError)
      })

      render(
        <MapAddComponent
          onLocationSelect={mockOnLocationSelect}
          selectedLocation={null}
          existingCampsites={mockExistingCampsites}
        />
      )

      const getCurrentLocationButton = screen.getByText('現在位置を取得')
      fireEvent.click(getCurrentLocationButton)

      expect(consoleSpy).toHaveBeenCalledWith('位置情報の取得に失敗しました:', mockError)
      expect(alertSpy).toHaveBeenCalledWith('位置情報の取得に失敗しました。手動で地図上をクリックしてください。')

      consoleSpy.mockRestore()
      alertSpy.mockRestore()
    })

    it('geolocationがサポートされていない場合', () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      })

      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(
        <MapAddComponent
          onLocationSelect={mockOnLocationSelect}
          selectedLocation={null}
          existingCampsites={mockExistingCampsites}
        />
      )

      const getCurrentLocationButton = screen.getByText('現在位置を取得')
      fireEvent.click(getCurrentLocationButton)

      expect(alertSpy).toHaveBeenCalledWith('このブラウザは位置情報に対応していません。')

      alertSpy.mockRestore()
    })
  })

  it('緯度・経度がnullの既存キャンプ場は表示されない', () => {
    const campsitesWithNullCoords: Campsite[] = [
      {
        id: '2',
        name: { ja: '座標なしキャンプ場', en: 'No Coords Campsite' },
        description: { ja: '説明', en: 'Description' },
        lat: null,
        lng: null,
        address: { ja: '東京都', en: 'Tokyo' },
        nearestStation: { ja: 'JR駅', en: 'JR Station' },
        accessTime: { ja: '徒歩10分', en: '10 min walk' },
        price: '¥2,000/泊',
        facilities: ['restroom'],
        activities: ['hiking'],
        website: 'https://example.com',
        phone: '03-1234-5678'
      }
    ]

    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={null}
        existingCampsites={campsitesWithNullCoords}
      />
    )

    // 座標がnullのキャンプ場のマーカーは表示されない
    const markers = screen.queryAllByTestId('mock-marker')
    expect(markers).toHaveLength(0)
  })

  it('複数の既存キャンプ場が表示される', () => {
    const multipleCampsites: Campsite[] = [
      mockExistingCampsites[0]!,
      {
        id: '3',
        name: { ja: 'キャンプ場2', en: 'Campsite 2' },
        description: { ja: '説明', en: 'Description' },
        lat: 36.0,
        lng: 140.0,
        address: { ja: '群馬県', en: 'Gunma' },
        nearestStation: { ja: 'JR駅', en: 'JR Station' },
        accessTime: { ja: '徒歩15分', en: '15 min walk' },
        price: '¥3,000/泊',
        facilities: ['restroom', 'shower'],
        activities: ['hiking', 'fishing'],
        website: 'https://example2.com',
        phone: '027-1234-5678'
      }
    ]

    render(
      <MapAddComponent
        onLocationSelect={mockOnLocationSelect}
        selectedLocation={null}
        existingCampsites={multipleCampsites}
      />
    )

    const markers = screen.getAllByTestId('mock-marker')
    expect(markers).toHaveLength(2)
  })
})
