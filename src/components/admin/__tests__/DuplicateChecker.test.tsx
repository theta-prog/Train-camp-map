'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DuplicateChecker from '@/components/admin/DuplicateChecker'
import '@testing-library/jest-dom'

// fetch APIをモック
global.fetch = jest.fn()

const mockOnDuplicateFound = jest.fn()

const mockCampsites = [
  {
    id: '1',
    name: { ja: 'テストキャンプ場', en: 'Test Campsite' },
    lat: 35.6762,
    lng: 139.6503,
    address: { ja: '東京都渋谷区', en: 'Shibuya, Tokyo' },
    facilities: ['restroom'],
    activities: ['hiking']
  },
  {
    id: '2',  
    name: { ja: '山のキャンプ場', en: 'Mountain Campsite' },
    lat: 35.6800,
    lng: 139.6600,
    address: { ja: '東京都新宿区', en: 'Shinjuku, Tokyo' },
    facilities: ['shower'],
    activities: ['fishing']
  }
]

describe('DuplicateChecker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCampsites }),
    })
  })

  it('コンポーネントが正しく表示される', () => {
    render(
      <DuplicateChecker 
        formData={{}} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    expect(screen.getByText('重複チェック')).toBeInTheDocument()
    expect(screen.getByText('名前や位置情報を入力してから重複チェックを実行してください')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'チェック' })).toBeInTheDocument()
  })

  it('データがない場合はチェックボタンが無効化される', () => {
    render(
      <DuplicateChecker 
        formData={{}} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    expect(checkButton).toBeDisabled()
    expect(screen.getByText('⚠️ キャンプ場名または位置情報を入力してください')).toBeInTheDocument()
  })

  it('名前がある場合はチェックボタンが有効化される', () => {
    render(
      <DuplicateChecker 
        formData={{ name_ja: 'テストキャンプ場' }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    expect(checkButton).not.toBeDisabled()
    expect(screen.queryByText('⚠️ キャンプ場名または位置情報を入力してください')).not.toBeInTheDocument()
  })

  it('位置情報がある場合はチェックボタンが有効化される', () => {
    render(
      <DuplicateChecker 
        formData={{ lat: 35.6762, lng: 139.6503 }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    expect(checkButton).not.toBeDisabled()
  })

  it('名前による重複チェックが正常に動作する', async () => {
    const user = userEvent.setup()
    
    render(
      <DuplicateChecker 
        formData={{ name_ja: 'テスト' }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/campsites')
    })

    await waitFor(() => {
      expect(mockOnDuplicateFound).toHaveBeenCalledWith([mockCampsites[0]])
    })

    expect(screen.getByText(/最終チェック:/)).toBeInTheDocument()
  })

  it('位置による重複チェックが正常に動作する（100m以内）', async () => {
    const user = userEvent.setup()
    
    render(
      <DuplicateChecker 
        formData={{ lat: 35.6762, lng: 139.6503 }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    await waitFor(() => {
      expect(mockOnDuplicateFound).toHaveBeenCalledWith([mockCampsites[0]])
    })
  })

  it('重複が見つからない場合は空配列を返す', async () => {
    const user = userEvent.setup()
    
    render(
      <DuplicateChecker 
        formData={{ name_ja: '存在しないキャンプ場' }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    await waitFor(() => {
      expect(mockOnDuplicateFound).toHaveBeenCalledWith([])
    })
  })

  it('チェック中はローディング表示される', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(global.fetch as jest.Mock).mockReturnValue(promise)

    const user = userEvent.setup()
    
    render(
      <DuplicateChecker 
        formData={{ name_ja: 'テスト' }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    expect(screen.getByRole('button', { name: 'チェック中...' })).toBeInTheDocument()
    expect(checkButton).toBeDisabled()

    // プロミスを解決
    resolvePromise!({
      ok: true,
      json: async () => ({ data: [] }),
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'チェック' })).toBeInTheDocument()
    })
  })

  it('APIエラー時でもエラーハンドリングされる', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const user = userEvent.setup()
    
    render(
      <DuplicateChecker 
        formData={{ name_ja: 'テスト' }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Duplicate check failed:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('APIレスポンスがエラーの場合は何もしない', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'API Error' }),
    })

    const user = userEvent.setup()
    
    render(
      <DuplicateChecker 
        formData={{ name_ja: 'テスト' }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // onDuplicateFoundが呼ばれないことを確認
    expect(mockOnDuplicateFound).not.toHaveBeenCalled()
  })

  it('formDataにデータがない場合は早期リターンされる', async () => {
    render(
      <DuplicateChecker 
        formData={{}} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    // ボタンは無効化されているが、直接関数を呼ぶテストケース
    const checkButton = screen.getByRole('button', { name: 'チェック' })
    expect(checkButton).toBeDisabled()
    
    // APIが呼ばれないことを確認
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('距離計算が正確に動作する', async () => {
    const user = userEvent.setup()
    
    // 少し離れた位置（100m以上）
    render(
      <DuplicateChecker 
        formData={{ lat: 35.6800, lng: 139.6600 }} 
        onDuplicateFound={mockOnDuplicateFound}
      />
    )

    const checkButton = screen.getByRole('button', { name: 'チェック' })
    await user.click(checkButton)

    await waitFor(() => {
      // 山のキャンプ場の位置と一致するはず
      expect(mockOnDuplicateFound).toHaveBeenCalledWith([mockCampsites[1]])
    })
  })
})
