'use client'

import EditCampsitePage from '@/app/admin/campsites/[id]/edit/page'
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

// AdminLayoutをモック
jest.mock('@/components/admin/AdminLayout', () => {
  return function MockAdminLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="admin-layout">{children}</div>
  }
})

// CampsiteFormをモック
jest.mock('@/components/admin/CampsiteForm', () => {
  return function MockCampsiteForm({ initialData, onSubmit, isLoading, isEditMode }: any) {
    return (
      <div data-testid="campsite-form">
        <div data-testid="edit-mode">{isEditMode ? 'edit' : 'create'}</div>
        <div data-testid="initial-data">{initialData?.name_ja || 'no-data'}</div>
        <button
          onClick={() => onSubmit({
            name_ja: 'Updated Test Campsite',
            lat: 35.6762,
            lng: 139.6503,
          })}
          disabled={isLoading}
          data-testid="submit-button"
        >
          {isLoading ? '更新中...' : '更新'}
        </button>
      </div>
    )
  }
})

// fetch APIをモック
global.fetch = jest.fn()

const mockCampsiteData = {
  id: '1',
  nameJa: 'テストキャンプ場',
  nameEn: 'Test Campsite',
  lat: 35.6762,
  lng: 139.6503,
  addressJa: '東京都渋谷区',
  addressEn: 'Shibuya, Tokyo',
  descriptionJa: 'テスト説明',
  descriptionEn: 'Test description',
  facilities: ['restroom', 'shower'],
  activities: ['hiking'],
  nearestStationJa: 'JR渋谷駅',
  nearestStationEn: 'JR Shibuya Station',
  accessTimeJa: '徒歩15分',
  accessTimeEn: '15 min walk',
  price: '¥2,000/泊',
  phone: '03-1234-5678',
  website: 'https://example.com',
  checkInTime: '14:00',
  checkOutTime: '11:00',
  cancellationPolicyJa: 'キャンセル料あり',
  cancellationPolicyEn: 'Cancellation fee applies',
}

describe('EditCampsitePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // デフォルトのfetchレスポンスを設定（成功時）
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCampsiteData }),
    })
  })

  it('ページが正しく表示される', async () => {
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByText('キャンプ場編集')).toBeInTheDocument()
    })

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
    expect(screen.getByTestId('campsite-form')).toBeInTheDocument()
    expect(screen.getByTestId('edit-mode')).toHaveTextContent('edit')
  })

  it('キャンプ場データが正常に読み込まれる', async () => {
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/campsites/1')
    })

    await waitFor(() => {
      expect(screen.getByTestId('initial-data')).toHaveTextContent('テストキャンプ場')
    })
  })

  it('データ読み込み中にローディング表示される', () => {
    render(<EditCampsitePage params={{ id: '1' }} />)

    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('キャンプ場が見つからない場合にエラーメッセージが表示される', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'キャンプ場が見つかりません' })
    })

    render(<EditCampsitePage params={{ id: '999' }} />)

    await waitFor(() => {
      expect(screen.getByText('キャンプ場が見つかりません')).toBeInTheDocument()
    })
  })

  it('データ読み込みエラー時にエラーメッセージが表示される', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument()
    })
  })

  it('フォーム送信が成功する', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsiteData }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: '1', name_ja: 'Updated Test Campsite' } }),
      })
      
    const user = userEvent.setup()
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/campsites/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_ja: 'Updated Test Campsite',
          lat: 35.6762,
          lng: 139.6503,
        }),
      })
    })
  })

  it('成功時にリダイレクトされる', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsiteData }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: '1', name_ja: 'Updated Test Campsite' } }),
      })
      
    const user = userEvent.setup()
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/campsites')
    })
  })

  it('更新エラー時にエラーメッセージが表示される', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsiteData }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Update failed' }),
      })

    const user = userEvent.setup()
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument()
    })
  })

  it('ネットワークエラー時にエラーメッセージが表示される', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsiteData }),
      })
      .mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('更新中にエラーが発生しました')).toBeInTheDocument()
    })
  })

  it.skip('送信中はローディング状態が表示される', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsiteData }),
      })
      .mockReturnValueOnce(promise)

    const user = userEvent.setup()
    render(<EditCampsitePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    expect(screen.getByRole('button', { name: '更新中...' })).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // プロミスを解決
    resolvePromise!({
      ok: true,
      json: async () => ({ data: { id: '1' } }),
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument()
    })
  })

  it('パラメータが変更されると適切なAPIが呼ばれる', async () => {
    render(<EditCampsitePage params={{ id: '999' }} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/campsites/999')
    })
  })
})
