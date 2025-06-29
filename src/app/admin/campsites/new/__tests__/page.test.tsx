'use client'

import NewCampsitePage from '@/app/admin/campsites/new/page'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// next/navigationをモック
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Google Maps関連をモック
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: () => <div data-testid="google-map">Google Map Mock</div>,
  useMap: () => null,
  useMapsLibrary: () => null,
}))

// AdminLayoutをモック
jest.mock('@/components/admin/AdminLayout', () => {
  return function MockAdminLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="admin-layout">{children}</div>
  }
})

// MapPickerをモック
jest.mock('@/components/admin/MapPicker', () => {
  return function MockMapPicker() {
    return <div data-testid="map-picker">Map Picker Mock</div>
  }
})

// AddressGeocoderをモック
jest.mock('@/components/admin/AddressGeocoder', () => {
  return function MockAddressGeocoder() {
    return <div data-testid="address-geocoder">Address Geocoder Mock</div>
  }
})

// MapAddComponentをモック
jest.mock('@/components/admin/MapAddComponent', () => {
  return function MockMapAddComponent() {
    return <div data-testid="map-add-component">Map Add Component Mock</div>
  }
})

// CampsiteTemplateをモック
jest.mock('@/components/admin/CampsiteTemplate', () => {
  return function MockCampsiteTemplate() {
    return <div data-testid="campsite-template">Campsite Template Mock</div>
  }
})

// DuplicateCheckerをモック
jest.mock('@/components/admin/DuplicateChecker', () => {
  return function MockDuplicateChecker() {
    return <div data-testid="duplicate-checker">Duplicate Checker Mock</div>
  }
})

// CampsiteFormをモック
jest.mock('@/components/admin/CampsiteForm', () => {
  return function MockCampsiteForm({ onSubmit, isLoading }: any) {
    return (
      <div data-testid="campsite-form">
        <button
          onClick={() => onSubmit({
            name_ja: 'テストキャンプ場',
            lat: 35.6762,
            lng: 139.6503,
            address_ja: '東京都渋谷区',
            price: '¥2,000/泊',
            nearest_station_ja: 'JR渋谷駅',
            access_time_ja: '徒歩15分',
            description_ja: 'テストキャンプ場です',
            facilities: ['restroom'],
            activities: ['hiking'],
          })}
          disabled={isLoading}
          data-testid="submit-button"
        >
          {isLoading ? '送信中...' : '送信'}
        </button>
      </div>
    )
  }
})

// fetch APIをモック
global.fetch = jest.fn()

describe('NewCampsitePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // fetchのデフォルトレスポンスを設定
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: '1', name_ja: 'テストキャンプ場' } }),
    })
  })

  it('ページが正しく表示される', () => {
    render(<NewCampsitePage />)

    expect(screen.getByText('新規キャンプ場登録')).toBeInTheDocument()
    expect(screen.getByText('新しいキャンプ場の情報を入力してください')).toBeInTheDocument()
    expect(screen.getByTestId('campsite-form')).toBeInTheDocument()
  })

  it('AdminLayoutが使用される', () => {
    render(<NewCampsitePage />)
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('フォーム送信が成功する', async () => {
    const user = userEvent.setup()
    render(<NewCampsitePage />)

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/campsites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_ja: 'テストキャンプ場',
          lat: 35.6762,
          lng: 139.6503,
          address_ja: '東京都渋谷区',
          price: '¥2,000/泊',
          nearest_station_ja: 'JR渋谷駅',
          access_time_ja: '徒歩15分',
          description_ja: 'テストキャンプ場です',
          facilities: ['restroom'],
          activities: ['hiking'],
        }),
      })
    })
  })

  it('成功時に成功メッセージが表示される', async () => {
    const user = userEvent.setup()
    render(<NewCampsitePage />)

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('登録完了')).toBeInTheDocument()
      expect(screen.getByText('キャンプ場の登録が完了しました。キャンプ場一覧ページに移動します...')).toBeInTheDocument()
    })
  })

  it('成功時にリダイレクトされる', async () => {
    const user = userEvent.setup()
    render(<NewCampsitePage />)

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    // 2秒後にリダイレクトされることを確認
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/campsites')
    }, { timeout: 3000 })
  })

  it('エラー時にエラーメッセージが表示される', async () => {
    // fetchを失敗させる
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'バリデーションエラー' }),
    })

    const user = userEvent.setup()
    render(<NewCampsitePage />)

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
      expect(screen.getByText('バリデーションエラー')).toBeInTheDocument()
    })
  })

  it('ネットワークエラー時にエラーメッセージが表示される', async () => {
    // fetchでネットワークエラーを発生させる
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const user = userEvent.setup()
    render(<NewCampsitePage />)

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('送信中はローディング状態が表示される', async () => {
    // fetchを遅延させる
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ data: { id: '1' } }),
      }), 100))
    )

    const user = userEvent.setup()
    render(<NewCampsitePage />)

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    // ローディング状態の確認
    expect(screen.getByText('送信中...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // 完了まで待機
    await waitFor(() => {
      expect(screen.getByText('登録完了')).toBeInTheDocument()
    })
  })
})
