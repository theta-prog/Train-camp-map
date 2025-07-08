import { supabase } from '@/lib/supabase'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
let LoginForm: typeof import('../LoginForm').default

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}))

global.fetch = jest.fn()

// LoginFormをmock適用後にimport
beforeAll(() => {
  LoginForm = require('../LoginForm').default
})

describe('LoginForm', () => {
  const push = jest.fn()
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push })
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('renders the login form', () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
  })

  it('shows an error message on failed login', async () => {
    const signInWithPassword = supabase.auth.signInWithPassword as jest.Mock
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } })

    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('メールアドレス'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('パスワード'), 'wrong-password')
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument()
    })
    expect(push).not.toHaveBeenCalled()
  })

  it('redirects to admin page on successful login', async () => {
    const signInWithPassword = supabase.auth.signInWithPassword as jest.Mock
    signInWithPassword.mockResolvedValue({ error: null })

    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('メールアドレス'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('パスワード'), 'password')
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/admin/campsites')
    })
  })

  it('toggles between login and sign up form', async () => {
    render(<LoginForm />)
    const toggleButton = screen.getByText('アカウントをお持ちでない方はこちら')
    fireEvent.click(toggleButton)

    expect(await screen.findByRole('button', { name: 'アカウント登録' })).toBeInTheDocument()

    const backToLoginButton = screen.getByText('すでにアカウントをお持ちの方はこちら')
    fireEvent.click(backToLoginButton)

    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
  })

  it('shows an error if sign up fails', async () => {
    const signUp = supabase.auth.signUp as jest.Mock
    signUp.mockResolvedValue({ error: { message: 'Sign up failed' } })
    
    // check-email APIをモック
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ allowed: true })
    })

    render(<LoginForm />)
    fireEvent.click(screen.getByText('アカウントをお持ちでない方はこちら'))

    await userEvent.type(screen.getByPlaceholderText('メールアドレス'), 'new@example.com')
    await userEvent.type(screen.getByPlaceholderText('パスワード（6文字以上）'), 'password123')
    fireEvent.click(screen.getByRole('button', { name: 'アカウント登録' }))

    await waitFor(() => {
      expect(screen.getByText('Sign up failed')).toBeInTheDocument()
    })
  })

  it('signs up a new user and redirects', async () => {
    const signUp = supabase.auth.signUp as jest.Mock
    signUp.mockResolvedValue({ error: null })
    
    // check-email APIをモック
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ allowed: true })
    })

    render(<LoginForm />)
    fireEvent.click(screen.getByText('アカウントをお持ちでない方はこちら'))

    await userEvent.type(screen.getByPlaceholderText('メールアドレス'), 'new@example.com')
    await userEvent.type(screen.getByPlaceholderText('パスワード（6文字以上）'), 'password123')
    
    fireEvent.click(screen.getByRole('button', { name: 'アカウント登録' }))

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      })
    })
    
    // 成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/確認メールを送信しました/)).toBeInTheDocument()
    })
  })
})
