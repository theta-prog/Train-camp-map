import { render, screen } from '@testing-library/react';
import GoogleMapsProvider from '../GoogleMapsProvider';

// APIProvider をモック
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children, apiKey }: { children: React.ReactNode; apiKey: string }) => (
    <div data-testid="api-provider" data-api-key={apiKey}>
      {children}
    </div>
  )
}))

describe('GoogleMapsProvider', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('APIキーが設定されている場合、APIProviderでラップする', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'

    render(
      <GoogleMapsProvider>
        <div>Test Content</div>
      </GoogleMapsProvider>
    )

    expect(screen.getByTestId('api-provider')).toBeInTheDocument()
    expect(screen.getByTestId('api-provider')).toHaveAttribute('data-api-key', 'test-api-key')
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('APIキーが設定されていない場合、そのまま子要素を表示', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    render(
      <GoogleMapsProvider>
        <div>Test Content</div>
      </GoogleMapsProvider>
    )

    expect(screen.queryByTestId('api-provider')).not.toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('APIキーが空文字の場合、そのまま子要素を表示', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = ''

    render(
      <GoogleMapsProvider>
        <div>Test Content</div>
      </GoogleMapsProvider>
    )

    expect(screen.queryByTestId('api-provider')).not.toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('複数の子要素を正しく表示', () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-key'

    render(
      <GoogleMapsProvider>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </GoogleMapsProvider>
    )

    expect(screen.getByTestId('api-provider')).toBeInTheDocument()
    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
    expect(screen.getByText('Third Child')).toBeInTheDocument()
  })
})
