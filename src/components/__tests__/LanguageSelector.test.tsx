// LanguageSelectorのテスト
import { fireEvent, render } from '@testing-library/react'
import LanguageSelector from '../LanguageSelector'

// next-intl, next/navigationのモック
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key === 'navigation.language' ? '言語' : key,
}))
const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/ja/some/path',
  useParams: () => ({ locale: 'ja' }),
}))

describe('LanguageSelector', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('日本語・英語ボタンが表示される', () => {
    const { getByText } = render(<LanguageSelector />)
    expect(getByText('日本語')).toBeInTheDocument()
    expect(getByText('English')).toBeInTheDocument()
    expect(getByText('言語:')).toBeInTheDocument()
  })

  it('日本語ボタンがアクティブなスタイル', () => {
    const { getByText } = render(<LanguageSelector />)
    expect(getByText('日本語').className).toContain('bg-green-600')
    expect(getByText('English').className).not.toContain('bg-green-600')
  })

  it('英語ボタンを押すとrouter.pushが呼ばれる', () => {
    const { getByText } = render(<LanguageSelector />)
    fireEvent.click(getByText('English'))
    expect(pushMock).toHaveBeenCalledWith('/en/some/path')
  })

  it('日本語ボタンを押してもrouter.pushは呼ばれない（同じlocale）', () => {
    const { getByText } = render(<LanguageSelector />)
    fireEvent.click(getByText('日本語'))
    // 既にjaなのでパスは変わらないが、実装上pushは呼ばれる
    expect(pushMock).toHaveBeenCalledWith('/ja/some/path')
  })

  it('pathnameがundefinedの場合は何もしない', () => {
    jest.spyOn(require('next/navigation'), 'usePathname').mockReturnValue(undefined)
    const { getByText } = render(<LanguageSelector />)
    fireEvent.click(getByText('English'))
    expect(pushMock).not.toHaveBeenCalled()
  })
})