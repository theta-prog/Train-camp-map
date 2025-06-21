import '@testing-library/jest-dom'

// next-intl/navigationのモック
const mockCreateNavigation = jest.fn()
jest.mock('next-intl/navigation', () => ({
  createNavigation: mockCreateNavigation
}))

// routingのモック
jest.mock('../routing', () => ({
  routing: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja'
  }
}))

describe('navigation configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateNavigation.mockReturnValue({
      Link: jest.fn(),
      redirect: jest.fn(),
      usePathname: jest.fn(),
      useRouter: jest.fn(),
      getPathname: jest.fn()
    })
  })

  test('navigationオブジェクトが正しく作成される', () => {
    const { Link, redirect, usePathname, useRouter, getPathname } = require('../navigation')
    
    expect(mockCreateNavigation).toHaveBeenCalledWith({
      locales: ['ja', 'en'],
      defaultLocale: 'ja'
    })
    
    expect(Link).toBeDefined()
    expect(redirect).toBeDefined()
    expect(usePathname).toBeDefined()
    expect(useRouter).toBeDefined()
    expect(getPathname).toBeDefined()
  })

  test('navigationのすべてのAPIが利用可能', () => {
    const navigation = require('../navigation')
    
    expect(navigation.Link).toBeDefined()
    expect(navigation.redirect).toBeDefined()
    expect(navigation.usePathname).toBeDefined()
    expect(navigation.useRouter).toBeDefined()
    expect(navigation.getPathname).toBeDefined()
  })
})
