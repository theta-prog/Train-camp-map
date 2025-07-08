'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddressGeocoder from '@/components/admin/AddressGeocoder'
import '@testing-library/jest-dom'

const mockOnLocationFound = jest.fn()

// Google Maps Geocoder をモック
const mockGeocode = jest.fn()
const mockGeocoder = {
  geocode: mockGeocode
}

// google.maps をグローバルモック
;(global as any).google = {
  maps: {
    Geocoder: jest.fn(() => mockGeocoder)
  }
}

describe('AddressGeocoder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('コンポーネントが正しく表示される', () => {
    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    expect(screen.getByText('住所から位置を検索')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('例: 東京都八王子市高尾町')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument()
  })

  it('住所を入力して検索ボタンをクリックできる', async () => {
    const user = userEvent.setup()
    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '東京都渋谷区')
    expect(input).toHaveValue('東京都渋谷区')

    await user.click(searchButton)
    expect(mockGeocoder.geocode).toHaveBeenCalledWith({ address: '東京都渋谷区' })
  })

  it('Enterキーで検索が実行される', async () => {
    const user = userEvent.setup()
    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    await user.type(input, '東京都新宿区')
    await user.keyboard('{Enter}')

    expect(mockGeocoder.geocode).toHaveBeenCalledWith({ address: '東京都新宿区' })
  })

  it('正常なジオコーディング結果で onLocationFound が呼ばれる', async () => {
    const user = userEvent.setup()
    const mockResult = {
      results: [
        {
          geometry: {
            location: {
              lat: () => 35.6762,
              lng: () => 139.6503
            }
          },
          formatted_address: '日本、〒150-0043 東京都渋谷区道玄坂'
        }
      ]
    }

    mockGeocode.mockResolvedValue(mockResult)

    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '東京都渋谷区道玄坂')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockOnLocationFound).toHaveBeenCalledWith(
        35.6762,
        139.6503,
        '日本、〒150-0043 東京都渋谷区道玄坂'
      )
    })

    // 検索後に入力フィールドがクリアされる
    expect(input).toHaveValue('')
  })

  it('空の住所で検索するとエラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const searchButton = screen.getByRole('button', { name: '検索' })
    await user.click(searchButton)

    expect(screen.getByText('住所を入力してください')).toBeInTheDocument()
    expect(mockGeocoder.geocode).not.toHaveBeenCalled()
  })

  it('空白のみの住所で検索するとエラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '   ')
    await user.click(searchButton)

    expect(screen.getByText('住所を入力してください')).toBeInTheDocument()
    expect(mockGeocoder.geocode).not.toHaveBeenCalled()
  })

  it('結果が見つからない場合のエラーメッセージ', async () => {
    const user = userEvent.setup()
    mockGeocode.mockResolvedValue({ results: [] })

    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '存在しない住所')
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('住所が見つかりませんでした')).toBeInTheDocument()
    })

    expect(mockOnLocationFound).not.toHaveBeenCalled()
  })

  it('不正な結果の場合のエラーメッセージ', async () => {
    const user = userEvent.setup()
    const mockResult = {
      results: [
        {
          geometry: null, // 不正なデータ
          formatted_address: null
        }
      ]
    }

    mockGeocode.mockResolvedValue(mockResult)

    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '東京都')
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('位置情報の取得に失敗しました')).toBeInTheDocument()
    })

    expect(mockOnLocationFound).not.toHaveBeenCalled()
  })

  it('ジオコーディングAPIエラーの場合のエラーメッセージ', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockGeocode.mockRejectedValue(new Error('API Error'))

    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '東京都渋谷区')
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('住所の変換に失敗しました')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Geocoding error:', expect.any(Error))
    expect(mockOnLocationFound).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('検索中はローディング状態が表示される', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    mockGeocode.mockReturnValue(promise)

    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    const searchButton = screen.getByRole('button', { name: '検索' })

    await user.type(input, '東京都渋谷区')
    await user.click(searchButton)

    expect(screen.getByRole('button', { name: '検索中...' })).toBeInTheDocument()
    expect(searchButton).toBeDisabled()

    // プロミスを解決
    resolvePromise!({ results: [] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument()
    })
  })

  it('エラー状態から正常状態に復帰する', async () => {
    const user = userEvent.setup()
    render(<AddressGeocoder onLocationFound={mockOnLocationFound} />)

    const searchButton = screen.getByRole('button', { name: '検索' })

    // まずエラー状態にする
    await user.click(searchButton)
    expect(screen.getByText('住所を入力してください')).toBeInTheDocument()

    // 正常な検索を実行
    const input = screen.getByPlaceholderText('例: 東京都八王子市高尾町')
    await user.type(input, '東京都渋谷区')

    mockGeocode.mockResolvedValue({
      results: [
        {
          geometry: {
            location: {
              lat: () => 35.6762,
              lng: () => 139.6503
            }
          },
          formatted_address: '東京都渋谷区'
        }
      ]
    })

    await user.click(searchButton)

    await waitFor(() => {
      expect(mockOnLocationFound).toHaveBeenCalled()
    })

    // エラーメッセージが消える
    expect(screen.queryByText('住所を入力してください')).not.toBeInTheDocument()
  })
})
