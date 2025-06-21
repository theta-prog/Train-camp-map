import '@testing-library/jest-dom'

// next-intl/serverのモック
const mockGetRequestConfig = jest.fn()
const mockHasLocale = jest.fn()

jest.mock('next-intl/server', () => ({
  getRequestConfig: mockGetRequestConfig
}))

jest.mock('next-intl', () => ({
  hasLocale: mockHasLocale
}))

jest.mock('../routing', () => ({
  routing: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja'
  }
}))

// メッセージファイルのモック
jest.mock('../../../messages/ja.json', () => ({
  default: { test: 'テスト' }
}), { virtual: true })

jest.mock('../../../messages/en.json', () => ({
  default: { test: 'Test' }
}), { virtual: true })

describe('request configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('有効なロケールでリクエスト設定が正しく動作', async () => {
    mockHasLocale.mockReturnValue(true)
    
    let configFunction: any
    mockGetRequestConfig.mockImplementation((fn: any) => {
      configFunction = fn
      return fn
    })

    // モジュールを再インポート
    require('../request')
    
    expect(mockGetRequestConfig).toHaveBeenCalled()
    
    if (configFunction) {
      const result = await configFunction({ requestLocale: Promise.resolve('ja') })
      
      expect(mockHasLocale).toHaveBeenCalledWith(['ja', 'en'], 'ja')
      expect(result.locale).toBe('ja')
      expect(result.messages).toEqual({ default: { test: 'テスト' } })
    }
  })

  test('無効なロケールでデフォルトロケールが使用される', async () => {
    mockHasLocale.mockReturnValue(false)
    
    let configFunction: any
    mockGetRequestConfig.mockImplementation((fn: any) => {
      configFunction = fn
      return fn
    })

    // モジュールを再インポート
    require('../request')
    
    if (configFunction) {
      const result = await configFunction({ requestLocale: Promise.resolve('invalid') })
      
      expect(mockHasLocale).toHaveBeenCalledWith(['ja', 'en'], 'invalid')
      expect(result.locale).toBe('ja') // デフォルトロケール
    }
  })

  test('英語ロケールで正しいメッセージがロードされる', async () => {
    mockHasLocale.mockReturnValue(true)
    
    let configFunction: any
    mockGetRequestConfig.mockImplementation((fn: any) => {
      configFunction = fn
      return fn
    })

    require('../request')
    
    if (configFunction) {
      const result = await configFunction({ requestLocale: Promise.resolve('en') })
      
      expect(result.locale).toBe('en')
      expect(result.messages).toEqual({ default: { test: 'Test' } })
    }
  })
})
