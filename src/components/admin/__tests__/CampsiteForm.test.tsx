import CampsiteForm from '@/components/admin/CampsiteForm'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('CampsiteForm', () => {
  const mockOnSubmit = jest.fn()
  
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('基本的なフォーム要素が表示される', () => {
    render(<CampsiteForm {...defaultProps} />)

    // 必須フィールドの確認
    expect(screen.getByLabelText(/名前（日本語）/)).toBeInTheDocument()
    expect(screen.getByLabelText(/住所（日本語）/)).toBeInTheDocument()
    expect(screen.getByLabelText(/表示用料金/)).toBeInTheDocument()
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

  it('ローディング中は送信ボタンが無効化される', () => {
    render(<CampsiteForm {...defaultProps} isLoading={true} />)

    const submitButton = screen.getByRole('button', { name: /保存中.../ })
    expect(submitButton).toBeDisabled()
  })
})
