import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CampsiteForm from '@/components/admin/CampsiteForm'
import '@testing-library/jest-dom'

describe('CampsiteForm', () => {
  const mockOnSubmit = jest.fn()
  
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('レンダリング', () => {
    it('基本的なフォーム要素が表示される', () => {
      render(<CampsiteForm {...defaultProps} />)

      // 必須フィールドの確認
      expect(screen.getByLabelText(/名前（日本語）/)).toBeInTheDocument()
      expect(screen.getByLabelText(/緯度/)).toBeInTheDocument()
      expect(screen.getByLabelText(/経度/)).toBeInTheDocument()
      expect(screen.getByLabelText(/住所（日本語）/)).toBeInTheDocument()
      expect(screen.getByLabelText(/料金/)).toBeInTheDocument()
      expect(screen.getByLabelText(/最寄り駅（日本語）/)).toBeInTheDocument()
      expect(screen.getByLabelText(/アクセス時間（日本語）/)).toBeInTheDocument()
      expect(screen.getByLabelText(/説明（日本語）/)).toBeInTheDocument()

      // ボタンの確認
      expect(screen.getByRole('button', { name: /保存/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /キャンセル/ })).toBeInTheDocument()
    })

    it('設備のチェックボックスが表示される', () => {
      render(<CampsiteForm {...defaultProps} />)

      expect(screen.getByText('トイレ')).toBeInTheDocument()
      expect(screen.getByText('シャワー')).toBeInTheDocument()
      expect(screen.getByText('駐車場')).toBeInTheDocument()
      expect(screen.getByText('WiFi')).toBeInTheDocument()
    })

    it('アクティビティのチェックボックスが表示される', () => {
      render(<CampsiteForm {...defaultProps} />)

      expect(screen.getByText('ハイキング')).toBeInTheDocument()
      expect(screen.getByText('釣り')).toBeInTheDocument()
      expect(screen.getByText('水泳')).toBeInTheDocument()
      expect(screen.getByText('サイクリング')).toBeInTheDocument()
    })
  })

  describe('初期データ', () => {
    it('初期データが正しく設定される', () => {
      const initialData = {
        name_ja: 'テストキャンプ場',
        lat: 35.6762,
        lng: 139.6503,
        facilities: ['restroom', 'shower'],
        activities: ['hiking'],
      }

      render(<CampsiteForm {...defaultProps} initialData={initialData} />)

      expect(screen.getByDisplayValue('テストキャンプ場')).toBeInTheDocument()
      expect(screen.getByDisplayValue('35.6762')).toBeInTheDocument()
      expect(screen.getByDisplayValue('139.6503')).toBeInTheDocument()
    })
  })

  describe('フォーム入力', () => {
    it('テキストフィールドに入力できる', async () => {
      const user = userEvent.setup()
      render(<CampsiteForm {...defaultProps} />)

      const nameInput = screen.getByLabelText(/名前（日本語）/)
      await user.type(nameInput, 'テスト入力')

      expect(nameInput).toHaveValue('テスト入力')
    })

    it('数値フィールドに入力できる', async () => {
      const user = userEvent.setup()
      render(<CampsiteForm {...defaultProps} />)

      const latInput = screen.getByLabelText(/緯度/)
      await user.clear(latInput)
      await user.type(latInput, '35.6762')

      expect(latInput).toHaveValue(35.6762)
    })

    it('チェックボックスを選択・解除できる', async () => {
      const user = userEvent.setup()
      render(<CampsiteForm {...defaultProps} />)

      const restroomCheckbox = screen.getByRole('checkbox', { name: /トイレ/ })
      expect(restroomCheckbox).not.toBeChecked()

      await user.click(restroomCheckbox)
      expect(restroomCheckbox).toBeChecked()

      await user.click(restroomCheckbox)
      expect(restroomCheckbox).not.toBeChecked()
    })
  })

  describe('フォーム送信', () => {
    it('有効なデータでフォーム送信が成功する', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)

      render(<CampsiteForm {...defaultProps} />)

      // 必須フィールドに入力
      await user.type(screen.getByLabelText(/名前（日本語）/), 'テストキャンプ場')
      await user.clear(screen.getByLabelText(/緯度/))
      await user.type(screen.getByLabelText(/緯度/), '35.6762')
      await user.clear(screen.getByLabelText(/経度/))
      await user.type(screen.getByLabelText(/経度/), '139.6503')
      await user.type(screen.getByLabelText(/住所（日本語）/), '東京都渋谷区')
      await user.type(screen.getByLabelText(/料金/), '¥2,000/泊')
      await user.type(screen.getByLabelText(/最寄り駅（日本語）/), 'JR渋谷駅')
      await user.type(screen.getByLabelText(/アクセス時間（日本語）/), '徒歩15分')
      await user.type(screen.getByLabelText(/説明（日本語）/), 'テストキャンプ場です')

      // 設備を選択
      await user.click(screen.getByRole('checkbox', { name: /トイレ/ }))
      
      // フォーム送信
      await user.click(screen.getByRole('button', { name: /保存/ }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name_ja: 'テストキャンプ場',
            lat: 35.6762,
            lng: 139.6503,
            address_ja: '東京都渋谷区',
            price: '¥2,000/泊',
            nearest_station_ja: 'JR渋谷駅',
            access_time_ja: '徒歩15分',
            description_ja: 'テストキャンプ場です',
            facilities: ['restroom'],
          })
        )
      }, { timeout: 3000 })
    })

    it('必須フィールドが空の場合エラーメッセージが表示される', async () => {
      const user = userEvent.setup()
      render(<CampsiteForm {...defaultProps} />)

      // フォームを空のまま送信
      await user.click(screen.getByRole('button', { name: /保存/ }))

      await waitFor(() => {
        expect(screen.getByText(/日本語名は必須です/)).toBeInTheDocument()
      })
    })
  })

  describe('ローディング状態', () => {
    it('ローディング中は送信ボタンが無効化される', () => {
      render(<CampsiteForm {...defaultProps} isLoading={true} />)

      const submitButton = screen.getByRole('button', { name: /保存中.../ })
      expect(submitButton).toBeDisabled()
    })

    it('ローディング中はボタンテキストが変更される', () => {
      render(<CampsiteForm {...defaultProps} isLoading={true} />)

      expect(screen.getByText('保存中...')).toBeInTheDocument()
      expect(screen.queryByText('保存')).not.toBeInTheDocument()
    })
  })

  describe('キャンセル機能', () => {
    it('キャンセルボタンクリックで履歴を戻る', async () => {
      const user = userEvent.setup()
      
      // window.history.backをモック
      const mockBack = jest.fn()
      Object.defineProperty(window, 'history', {
        value: { back: mockBack },
        writable: true
      })

      render(<CampsiteForm {...defaultProps} />)

      await user.click(screen.getByRole('button', { name: /キャンセル/ }))
      expect(mockBack).toHaveBeenCalled()
    })
  })

  describe('バリデーション', () => {
    it('無効なURL形式でエラーメッセージが表示される', async () => {
      const user = userEvent.setup()
      render(<CampsiteForm {...defaultProps} />)

      const websiteInput = screen.getByLabelText(/ウェブサイト/)
      await user.type(websiteInput, 'invalid-url')

      // フォーカスを外してバリデーションをトリガー
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/有効なURLを入力してください/)).toBeInTheDocument()
      })
    })

    it('緯度が範囲外の場合エラーメッセージが表示される', async () => {
      const user = userEvent.setup()
      render(<CampsiteForm {...defaultProps} />)

      const latInput = screen.getByLabelText(/緯度/)
      await user.clear(latInput)
      await user.type(latInput, '91')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/緯度は90以下である必要があります/)).toBeInTheDocument()
      })
    })
  })
})
