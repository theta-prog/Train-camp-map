import { fireEvent, render, screen } from '@testing-library/react'
import LanguageSwitcher from '../LanguageSwitcher'

// next-intlをモック
jest.mock('next-intl', () => ({
  useLocale: jest.fn(() => 'ja'),
}))

// i18n/navigationをモック
jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  usePathname: jest.fn(() => '/test'),
}))

describe('LanguageSwitcher 異常系', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('クリック時にpushが呼ばれない場合でもクラッシュしない', () => {
    const { useRouter } = require('@/i18n/navigation')
    useRouter.mockReturnValue({ push: undefined })
    
    render(<LanguageSwitcher />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getAllByText('日本語')).toHaveLength(2)
  })
  
  it('pathnameが取得できない場合でもクラッシュしない', () => {
    const { usePathname } = require('@/i18n/navigation')
    usePathname.mockReturnValue(undefined)
    
    render(<LanguageSwitcher />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('localeが取得できない場合でもクラッシュしない', () => {
    const { useLocale } = require('next-intl')
    useLocale.mockReturnValue(undefined)
    
    render(<LanguageSwitcher />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
