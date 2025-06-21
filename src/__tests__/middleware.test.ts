import '@testing-library/jest-dom'

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
    mockCreateMiddleware.mockReturnValue(jest.fn())
  })

  test('middlewareが正しく作成される', () => {
    // middlewareをインポート
    require('../middleware')
    
    expect(mockCreateMiddleware).toHaveBeenCalledWith({
      locales: ['ja', 'en'],
      defaultLocale: 'ja'
    })
    expect(mockCreateMiddleware).toHaveBeenCalledTimes(1)
  })

  test('configが正しく設定されている', () => {
    const middlewareModule = require('../middleware')
    
    expect(middlewareModule.config).toBeDefined()
    expect(middlewareModule.config.matcher).toEqual(['/', '/(ja|en)/:path*'])
  })

  test('middlewareがexportされている', () => {
    const middlewareModule = require('../middleware')
    
    expect(middlewareModule.default).toBeDefined()
    expect(typeof middlewareModule.default).toBe('function')
  })
})
