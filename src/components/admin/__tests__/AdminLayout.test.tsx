import { render, screen } from '@testing-library/react'
import AdminLayout from '@/components/admin/AdminLayout'
import '@testing-library/jest-dom'

// next/linkをモック
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

describe('AdminLayout', () => {
  const TestContent = () => <div data-testid="test-content">テストコンテンツ</div>

  it('ヘッダーが正しく表示される', () => {
    render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    expect(screen.getByText('キャンプ場管理システム')).toBeInTheDocument()
  })

  it('ナビゲーションリンクが表示される', () => {
    render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    expect(screen.getByText('キャンプ場一覧')).toBeInTheDocument()
    expect(screen.getByText('新規登録')).toBeInTheDocument()
    expect(screen.getByText('サイトに戻る')).toBeInTheDocument()
  })

  it('ナビゲーションリンクが正しいhrefを持つ', () => {
    render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    expect(screen.getByText('ダッシュボード').closest('a')).toHaveAttribute('href', '/admin')
    expect(screen.getByText('キャンプ場一覧').closest('a')).toHaveAttribute('href', '/admin/campsites')
    expect(screen.getByText('新規登録').closest('a')).toHaveAttribute('href', '/admin/campsites/new')
    expect(screen.getByText('サイトに戻る').closest('a')).toHaveAttribute('href', '/')
  })

  it('子コンポーネントが正しく表示される', () => {
    render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
  })

  it('適切なCSSクラスが適用される', () => {
    render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    // メインコンテナの確認
    const mainContainer = screen.getByText('テストコンテンツ').closest('main')
    expect(mainContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8')
  })

  it('新規登録ボタンが強調表示される', () => {
    render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    const newCampsiteLink = screen.getByText('新規登録').closest('a')
    expect(newCampsiteLink).toHaveClass('bg-green-600', 'hover:bg-green-700', 'text-white')
  })

  it('レスポンシブデザインのクラスが適用される', () => {
    const { container } = render(
      <AdminLayout>
        <TestContent />
      </AdminLayout>
    )

    // ヘッダーのmax-w-7xlクラスを持つdivを直接取得
    const headerContainer = container.querySelector('header .max-w-7xl')
    expect(headerContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
    
    // メインコンテナの確認
    const mainContainer = screen.getByText('テストコンテンツ').closest('main')
    expect(mainContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8')
  })
})
