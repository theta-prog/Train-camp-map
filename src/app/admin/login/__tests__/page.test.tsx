import { render, screen } from '@testing-library/react'
import LoginPage from '../page'

jest.mock('@/components/admin/LoginForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="login-form">Login Form</div>,
  }
})

describe('LoginPage', () => {
  it('renders the LoginForm', async () => {
    render(<LoginPage />)
    expect(await screen.findByTestId('login-form')).toBeInTheDocument()
  })
})
