import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import CampsitesListPage from '@/app/admin/campsites/page'

// Next.jsのコンポーネントをモック
jest.mock('next/link', () => {
  const Link = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  Link.displayName = 'Link'
  return Link
})

// AdminLayoutをモック
jest.mock('@/components/admin/AdminLayout', () => {
  const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  )
  AdminLayout.displayName = 'AdminLayout'
  return AdminLayout
})

// fetch APIをモック
global.fetch = jest.fn()

// window.confirmをモック
global.confirm = jest.fn()

const mockCampsites = [
  {
    id: '1',
    name_ja: 'テストキャンプ場1',
    lat: 35.6762,
    lng: 139.6503,
    address_ja: '東京都渋谷区',
    price: '¥2,000/泊',
    nearest_station_ja: 'JR渋谷駅',
    access_time_ja: '徒歩15分',
    description_ja: 'テスト用のキャンプ場です',
    facilities: ['restroom', 'shower'],
    activities: ['hiking'],
  },
  {
    id: '2',
    name_ja: 'テストキャンプ場2',
    lat: 35.6762,
    lng: 139.6503,
    address_ja: '東京都新宿区',
    price: '¥3,000/泊',
  },
]

describe('CampsitesListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ローディング状態が正しく表示される', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // 永続的なpending状態

    render(<CampsitesListPage />)

    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('キャンプ場一覧が正しく表示される', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCampsites }),
    })

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('キャンプ場一覧')).toBeInTheDocument()
    })

    expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    expect(screen.getByText('テストキャンプ場2')).toBeInTheDocument()
    expect(screen.getByText('東京都渋谷区')).toBeInTheDocument()
    expect(screen.getByText('¥2,000/泊')).toBeInTheDocument()
  })

  it('キャンプ場が0件の場合の表示', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('キャンプ場が登録されていません')).toBeInTheDocument()
    })

    expect(screen.getByText('最初のキャンプ場を登録する')).toBeInTheDocument()
  })

  it('APIエラーが正しく表示される', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'サーバーエラー' }),
    })

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('サーバーエラー')).toBeInTheDocument()
    })
  })

  it('ネットワークエラーが正しく表示される', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument()
    })
  })

  it('削除機能が正しく動作する', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsites }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: '削除しました' }),
      })

    ;(global.confirm as jest.Mock).mockReturnValueOnce(true)

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('削除')
    fireEvent.click(deleteButtons[0]!)

    expect(global.confirm).toHaveBeenCalledWith('このキャンプ場を削除しますか？')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/campsites/1', {
        method: 'DELETE',
      })
    })
  })

  it('削除のキャンセルが正しく動作する', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCampsites }),
    })

    ;(global.confirm as jest.Mock).mockReturnValueOnce(false)

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('削除')
    fireEvent.click(deleteButtons[0]!)

    expect(global.confirm).toHaveBeenCalledWith('このキャンプ場を削除しますか？')

    // DELETEリクエストが送信されないことを確認
    expect(fetch).toHaveBeenCalledTimes(1) // 初期のGETリクエストのみ
  })

  it('削除失敗時のエラー表示', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampsites }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '削除に失敗しました' }),
      })

    ;(global.confirm as jest.Mock).mockReturnValueOnce(true)

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('削除')
    fireEvent.click(deleteButtons[0]!)

    await waitFor(() => {
      expect(screen.getByText('削除に失敗しました')).toBeInTheDocument()
    })
  })

  it('正しいリンクが設定されている', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCampsites }),
    })

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    })

    // 新規登録リンクの確認
    const newButtons = screen.getAllByText('新規登録')
    expect(newButtons[0]).toHaveAttribute('href', '/admin/campsites/new')

    // 編集リンクの確認
    const editButtons = screen.getAllByText('編集')
    expect(editButtons[0]).toHaveAttribute('href', '/admin/campsites/1/edit')
    expect(editButtons[1]).toHaveAttribute('href', '/admin/campsites/2/edit')
  })

  it('キャンプ場の詳細情報が正しく表示される', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCampsites }),
    })

    render(<CampsitesListPage />)

    await waitFor(() => {
      expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    })

    // 座標の表示確認
    expect(screen.getAllByText(/緯度: 35.6762/)).toHaveLength(2)
    expect(screen.getAllByText(/経度: 139.6503/)).toHaveLength(2)

    // 価格の表示確認
    expect(screen.getByText('¥2,000/泊')).toBeInTheDocument()
    expect(screen.getByText('¥3,000/泊')).toBeInTheDocument()
  })
})
