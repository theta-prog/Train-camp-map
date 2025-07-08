import { render, screen, waitFor } from '@testing-library/react'
import AuthGuard from '../AuthGuard'
let useRouter: any

// Next.jsのrouterをモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Supabaseのモック
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}))

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn()
}

const TestComponent = () => <div>Protected Content</div>

describe('AuthGuard', () => {
  beforeEach(() => {
    mockRouter.push = jest.fn()
    mockRouter.replace = jest.fn()
    useRouter = require('next/navigation').useRouter
    useRouter.mockReturnValue(mockRouter)
  })

  it('認証済みユーザーの場合、子コンポーネントを表示する', async () => {
    const { supabase } = require('@/lib/supabase')
    supabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          user: { id: '123', email: 'admin@example.com' },
          access_token: 'token123'
        }
      },
      error: null
    })

    render(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    )

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  it('未認証ユーザーの場合、ログインページにリダイレクトする', async () => {
    const { supabase } = require('@/lib/supabase')
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null
    })

    render(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    )

    // イベントループを進めて副作用を確実に発火させる
    await Promise.resolve()
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/login')
    }, { timeout: 2000 })
  })

  it('認証エラーの場合、ログインページにリダイレクトする', async () => {
    const { supabase } = require('@/lib/supabase')
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Auth error' }
    })

    render(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    )

    await Promise.resolve()
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/login?error=session_error')
    }, { timeout: 2000 })
  })

  it('ローディング中は何も表示しない', () => {
    const { supabase } = require('@/lib/supabase')
    // 永続的にpendingのPromiseを返す
    supabase.auth.getSession.mockReturnValue(new Promise(() => {}))

    render(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('認証状態の変更を監視する', async () => {
    const { supabase } = require('@/lib/supabase')
    const mockUnsubscribe = jest.fn()
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } }
    })

    supabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          user: { id: '123', email: 'admin@example.com' },
          access_token: 'token123'
        }
      },
      error: null
    })

    const { unmount } = render(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    )

    await waitFor(() => {
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    })

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('認証状態変更時にセッション切れの場合リダイレクトする', async () => {
    const { supabase } = require('@/lib/supabase')
    let authChangeCallback: any

    supabase.auth.onAuthStateChange.mockImplementation((callback: any) => {
      authChangeCallback = callback
      return {
        data: { subscription: { unsubscribe: jest.fn() } }
      }
    })

    supabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          user: { id: '123', email: 'admin@example.com' },
          access_token: 'token123'
        }
      },
      error: null
    })

    render(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    )

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    // 認証状態がSIGNED_OUTに変更された場合をシミュレート
    authChangeCallback('SIGNED_OUT', null)

    await Promise.resolve()
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/login')
    }, { timeout: 2000 })
  })
})