import '@testing-library/jest-dom';
(global as any).Response = function Response() {
  return {}
}

// joseライブラリのモック
jest.mock('jose', () => ({
  jwtVerify: jest.fn()
}))

// auth関数のモック
jest.mock('../lib/auth', () => ({
  getAuthFromRequest: jest.fn().mockResolvedValue(null)
}))

// NextResponseのモック
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn().mockReturnValue({
      headers: {
        set: jest.fn()
      }
    })
  }
}))

// next-intl/middlewareのモック
const mockCreateMiddleware = jest.fn()

jest.mock('next-intl/middleware', () => ({
  __esModule: true,
  default: mockCreateMiddleware
}))

jest.mock('../i18n/routing', () => ({
  routing: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja'
  }
}))

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockIntlMiddleware = jest.fn().mockResolvedValue(new Response())
    mockCreateMiddleware.mockReturnValue(mockIntlMiddleware)
  })

  test('middlewareが正しく作成される', async () => {
    // middlewareをインポート
    const middlewareModule = require('../middleware')
    const middleware = middlewareModule.default
    
    // テスト用のリクエストを作成
    const mockRequest = {
      nextUrl: {
        pathname: '/ja/test'
      }
    } as any
    
    // middlewareを実行
    await middleware(mockRequest)
    
    expect(mockCreateMiddleware).toHaveBeenCalledWith(expect.objectContaining({
      locales: ['ja', 'en'],
      defaultLocale: 'ja'
    }))
    expect(mockCreateMiddleware).toHaveBeenCalledTimes(1)
  })

  test('configが正しく設定されている', () => {
    const middlewareModule = require('../middleware')
    
    expect(middlewareModule.config).toBeDefined()
    expect(middlewareModule.config.matcher).toEqual([
      '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      '/(api|trpc)(.*)',
    ])
  })

  test('middlewareがexportされている', () => {
    const middlewareModule = require('../middleware')
    
    expect(middlewareModule.default).toBeDefined()
    expect(typeof middlewareModule.default).toBe('function')
  })
})
