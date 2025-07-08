import { render, screen } from '@testing-library/react'
import AdminDashboard from '../page'

// Mock AdminLayout to simplify testing
jest.mock('@/components/admin/AdminLayout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }
})

describe('AdminDashboard', () => {
  it('renders the main dashboard heading and description', () => {
    render(<AdminDashboard />)
    expect(
      screen.getByRole('heading', { name: 'ダッシュボード' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('キャンプ場管理システムにようこそ')
    ).toBeInTheDocument()
  })

  it('renders the statistics cards', () => {
    render(<AdminDashboard />)
    expect(screen.getByText('総キャンプ場数')).toBeInTheDocument()
    expect(screen.getByText('今月の新規登録')).toBeInTheDocument()
    expect(screen.getByText('最終更新')).toBeInTheDocument()
  })

  it('renders the quick action links and buttons', () => {
    render(<AdminDashboard />)
    expect(
      screen.getByRole('link', { name: '➕ 新規キャンプ場登録' })
    ).toHaveAttribute('href', '/admin/campsites/new')
    expect(
      screen.getByRole('link', { name: '📋 キャンプ場一覧' })
    ).toHaveAttribute('href', '/admin/campsites')
    expect(
      screen.getByRole('link', { name: '🌐 サイトプレビュー' })
    ).toHaveAttribute('href', '/')
    expect(
      screen.getByRole('button', { name: '⚙️ 設定（準備中）' })
    ).toBeDisabled()
  })
})
