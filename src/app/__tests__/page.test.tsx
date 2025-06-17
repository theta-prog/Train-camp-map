import '@testing-library/jest-dom'
import { redirect } from 'next/navigation'

// next/navigationのモック
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>

describe('Root Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('ルートページが/jaにリダイレクトする', () => {
    // コンポーネントをインポート
    const RootPage = require('../page').default
    
    // コンポーネントを実行
    RootPage()
    
    // リダイレクトが呼ばれることを確認
    expect(mockRedirect).toHaveBeenCalledWith('/ja')
    expect(mockRedirect).toHaveBeenCalledTimes(1)
  })

  test('リダイレクト関数が正しくインポートされている', () => {
    expect(mockRedirect).toBeDefined()
    expect(typeof mockRedirect).toBe('function')
  })

  test('RootPageコンポーネントが存在する', () => {
    const RootPage = require('../page').default
    expect(RootPage).toBeDefined()
    expect(typeof RootPage).toBe('function')
  })
})
