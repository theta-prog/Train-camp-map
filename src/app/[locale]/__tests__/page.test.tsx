import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// CampsiteSearchAppのモック
jest.mock('@/components/CampsiteSearchApp', () => {
  return function MockCampsiteSearchApp() {
    return <div data-testid="campsite-search-app">CampsiteSearchApp component</div>
  }
})

describe('HomePage ([locale])', () => {
  test('日本語ロケールで正しくレンダリングされる', async () => {
    const HomePage = (await import('../page')).default
    
    // paramsをPromiseとして渡す
    const params = Promise.resolve({ locale: 'ja' })
    
    const result = await HomePage({ params })
    
    // JSXをレンダリング
    render(result)
    
    expect(screen.getByTestId('campsite-search-app')).toBeInTheDocument()
    expect(screen.getByText('CampsiteSearchApp component')).toBeInTheDocument()
  })

  test('英語ロケールで正しくレンダリングされる', async () => {
    const HomePage = (await import('../page')).default
    
    const params = Promise.resolve({ locale: 'en' })
    
    const result = await HomePage({ params })
    
    render(result)
    
    expect(screen.getByTestId('campsite-search-app')).toBeInTheDocument()
    expect(screen.getByText('CampsiteSearchApp component')).toBeInTheDocument()
  })

  test('カスタムロケールでレンダリングされる', async () => {
    const HomePage = (await import('../page')).default
    
    const params = Promise.resolve({ locale: 'custom-locale' })
    
    const result = await HomePage({ params })
    
    render(result)
    
    expect(screen.getByText('CampsiteSearchApp component')).toBeInTheDocument()
  })

  test('paramsが正しく処理される', async () => {
    const HomePage = (await import('../page')).default
    
    // パラメータが正しく展開されることを確認
    const params = Promise.resolve({ locale: 'test-locale', other: 'ignored' })
    
    const result = await HomePage({ params })
    
    render(result)
    
    expect(screen.getByText('CampsiteSearchApp component')).toBeInTheDocument()
  })

  test('HomePageコンポーネントがasync関数である', () => {
    const HomePage = require('../page').default
    expect(HomePage).toBeDefined()
    expect(typeof HomePage).toBe('function')
    expect(HomePage.constructor.name).toBe('AsyncFunction')
  })
})
