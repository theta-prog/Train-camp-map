import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import LanguageSwitcher from '../LanguageSwitcher'

// モック next-intl
const mockUseLocale = jest.fn(() => 'ja')
jest.mock('next-intl', () => ({
  useLocale: () => mockUseLocale()
}))

// モック next/navigation
const mockPush = jest.fn()
const mockPathname = '/test'

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  usePathname: () => mockPathname
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // スナップショットテスト - 効率的な100%UIカバレッジ
  describe('スナップショットテスト', () => {
    it('日本語ロケール（閉じている状態）', () => {
      const { container } = render(<LanguageSwitcher />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('ドロップダウン開いている状態', () => {
      const { container } = render(<LanguageSwitcher />)
      
      // ドロップダウンを開く
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  it('基本的なレンダリングテスト', () => {
    render(<LanguageSwitcher />)
    
    // ボタンが存在することを確認
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    // 日本語表記があることを確認
    expect(screen.getByText('日本語')).toBeInTheDocument()
    
    // 国旗があることを確認
    expect(screen.getByText('🇯🇵')).toBeInTheDocument()
  })

  it('ドロップダウンの開閉が機能する', () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    
    // 初期状態では英語オプションは表示されない
    expect(screen.queryByText('English')).not.toBeInTheDocument()
    
    // ボタンをクリックしてドロップダウンを開く
    fireEvent.click(button)
    
    // 英語オプションが表示される
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('言語変更時にルーター遷移が呼ばれる', () => {
    render(<LanguageSwitcher />)
    
    // ドロップダウンを開く
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // 英語オプションをクリック
    const englishButton = screen.getByText('English')
    fireEvent.click(englishButton)
    
    // ルーター遷移が呼ばれることを確認
    expect(mockPush).toHaveBeenCalledWith('/test', { locale: 'en' })
  })

  it('背景クリックでドロップダウンが閉じる', () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // 英語オプションが表示される
    expect(screen.getByText('English')).toBeInTheDocument()
    
    // 背景をクリック
    const overlay = document.querySelector('.fixed.inset-0.z-40')
    if (overlay) {
      fireEvent.click(overlay)
    }
    
    // 英語オプションが非表示になる
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('英語ロケールでのレンダリングとチェックマーク非表示', () => {
    // 英語環境でテスト
    mockUseLocale.mockReturnValue('en')
    
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // 英語オプションには選択状態のスタイルが適用される
    const englishElements = screen.getAllByText('English')
    expect(englishElements).toHaveLength(2)
    const englishOption = englishElements[1]?.closest('button') // ドロップダウン内の要素
    expect(englishOption).toHaveClass('bg-green-50', 'text-green-700')
    
    // 英語にはチェックマークが表示される
    expect(englishOption?.querySelector('svg')).toBeInTheDocument()
    
    // 日本語にはチェックマークが表示されない（条件分岐line 49）
    const japaneseButton = screen.getByText('日本語').closest('button')
    expect(japaneseButton?.querySelector('svg')).toBeNull()
  })

  it('ドロップダウン背景クリックでの状態変更', () => {
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // ドロップダウンが開いている（2つのEnglishテキストが存在）
    const englishElements = screen.getAllByText('English')
    expect(englishElements).toHaveLength(2)
    
    // 背景クリックでsetIsOpenが呼ばれる
    const overlay = document.querySelector('.fixed.inset-0.z-40')
    if (overlay) {
      fireEvent.click(overlay)
    }
    
    // ドロップダウンが閉じる（Englishテキストが1つだけになる）
    const englishElementsAfterClose = screen.getAllByText('English')
    expect(englishElementsAfterClose).toHaveLength(1)
  })

  it('handleLanguageChangeでルーター遷移', () => {
    mockUseLocale.mockReturnValue('ja')
    
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // 日本語ボタンをクリック（現在の言語と同じ）
    const japaneseElements = screen.getAllByText('日本語')
    expect(japaneseElements).toHaveLength(2)
    const japaneseButton = japaneseElements[1] // ドロップダウン内の要素
    if (japaneseButton) {
      fireEvent.click(japaneseButton)
    }
    
    // ルーター遷移が呼ばれることを確認
    expect(mockPush).toHaveBeenCalledWith('/test', { locale: 'ja' })
  })

  it('locale未定義時のフォールバック処理', () => {
    // localeがundefinedの場合をテスト
    (mockUseLocale as jest.Mock).mockReturnValue(undefined)
    
    render(<LanguageSwitcher />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // デフォルトで日本語が選択されている
    const japaneseElements = screen.getAllByText('日本語')
    const japaneseOption = japaneseElements[1]?.closest('button')
    expect(japaneseOption).toHaveClass('bg-green-50', 'text-green-700')
    
    // 日本語にはチェックマークが表示される
    expect(japaneseOption?.querySelector('svg')).toBeInTheDocument()
  })
})
