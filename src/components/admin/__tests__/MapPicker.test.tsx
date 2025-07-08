import { render, screen } from '@testing-library/react'
import MapPicker from '../MapPicker'

// Google Maps関連のモック
jest.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children }: any) => <div data-testid="google-map">{children}</div>,
  AdvancedMarker: () => <div data-testid="map-marker" />,
  useMap: () => ({
    addListener: jest.fn(() => ({ remove: jest.fn() }))
  })
}))

const mockOnLocationSelect = jest.fn()

describe('MapPicker', () => {
  beforeAll(() => {
    // グローバルgoogleオブジェクトを最低限モック
    global.google = {
      maps: {
        event: {
          removeListener: jest.fn(),
          addDomListener: jest.fn(),
          addDomListenerOnce: jest.fn(),
          addListener: jest.fn(),
          addListenerOnce: jest.fn(),
          clearInstanceListeners: jest.fn(),
          clearListeners: jest.fn(),
          hasListeners: jest.fn(),
          trigger: jest.fn()
        } as any
      } as any
    } as any
  })
  afterAll(() => {
    // @ts-ignore
    delete global.google
  })
  beforeEach(() => {
    jest.clearAllMocks()
    // Google Maps API キーを設定
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
  })
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })

  it('コンポーネントが正しくレンダリングされる', () => {
    render(<MapPicker onLocationSelect={mockOnLocationSelect} />)
    
    expect(screen.getByText('地図をクリックして位置を選択してください')).toBeInTheDocument()
    expect(screen.getByTestId('google-map')).toBeInTheDocument()
    expect(screen.getByTestId('map-marker')).toBeInTheDocument()
  })

  it('初期位置が正しく表示される', () => {
    const initialLat = 35.6895
    const initialLng = 139.6917
    
    render(
      <MapPicker 
        lat={initialLat}
        lng={initialLng}
        onLocationSelect={mockOnLocationSelect}
      />
    )

    expect(screen.getByText(/選択位置: 緯度 35\.689500, 経度 139\.691700/)).toBeInTheDocument()
  })

  it('デフォルト位置（東京）が使用される', () => {
    render(<MapPicker onLocationSelect={mockOnLocationSelect} />)
    
    expect(screen.getByText(/選択位置: 緯度 35\.676200, 経度 139\.650300/)).toBeInTheDocument()
  })

  it('APIキーが設定されていない場合、エラーメッセージを表示する', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    render(<MapPicker onLocationSelect={mockOnLocationSelect} />)
    
    expect(screen.getByText('Google Maps APIキーが設定されていません')).toBeInTheDocument()
    expect(screen.getByText('.env.localファイルにNEXT_PUBLIC_GOOGLE_MAPS_API_KEYを設定してください')).toBeInTheDocument()
  })

  it('APIキーが設定されていない場合でも現在の位置を表示する', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    const customLat = 40.7128
    const customLng = -74.0060
    
    render(
      <MapPicker 
        lat={customLat}
        lng={customLng}
        onLocationSelect={mockOnLocationSelect}
      />
    )
    
    expect(screen.getByText(/現在の位置: 緯度 40\.712800, 経度 -74\.006000/)).toBeInTheDocument()
  })

  it('位置が更新された場合、表示が更新される', () => {
    const { rerender } = render(
      <MapPicker 
        lat={35.6762}
        lng={139.6503}
        onLocationSelect={mockOnLocationSelect}
      />
    )

    expect(screen.getByText(/選択位置: 緯度 35\.676200, 経度 139\.650300/)).toBeInTheDocument()

    // 新しい位置で再レンダリング
    rerender(
      <MapPicker 
        lat={35.6895}
        lng={139.6917}
        onLocationSelect={mockOnLocationSelect}
      />
    )

    expect(screen.getByText(/選択位置: 緯度 35\.689500, 経度 139\.691700/)).toBeInTheDocument()
  })

  it('カスタムクラス名が適用される', () => {
    const customClassName = 'custom-map-picker'
    
    const { container } = render(
      <MapPicker 
        onLocationSelect={mockOnLocationSelect}
        className={customClassName}
      />
    )
    
    expect(container.firstChild).toHaveClass(customClassName)
  })

  it('マップが適切な設定で表示される', () => {
    render(<MapPicker onLocationSelect={mockOnLocationSelect} />)
    
    const mapContainer = screen.getByTestId('google-map')
    expect(mapContainer).toBeInTheDocument()
    
    // マーカーが表示されている
    expect(screen.getByTestId('map-marker')).toBeInTheDocument()
  })
})