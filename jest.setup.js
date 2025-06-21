import '@testing-library/jest-dom'

// Global React import for JSX transform
import React from 'react'
global.React = React

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key, params) => {
    // Simple mock implementation for translations
    const translations = {
      'campsiteList.title': 'Campsites',
      'campsiteList.noResults': 'No campsites found',
      'campsiteList.changeFilters': 'Try changing your search filters',
      'campsiteList.count': params ? `${params.count} found` : 'count',
      'campsiteList.nearestStation': 'Nearest Station',
      'campsiteList.access': 'Access',
      'campsiteList.clickForDetails': 'Click on a campsite for details',
      'facilities.restroom': 'Restroom',
      'facilities.shower': 'Shower',
      'facilities.parking': 'Parking',
      'facilities.wifi': 'WiFi',
      'facilities.bbq': 'BBQ',
      'activities.hiking': 'Hiking',
      'activities.fishing': 'Fishing',
      'activities.swimming': 'Swimming',
      'activities.cycling': 'Cycling',
    }
    return translations[key] || key
  }
}))

// Mock next-intl/routing
jest.mock('next-intl/routing', () => ({
  defineRouting: (config) => config,
  createSharedPathnamesNavigation: () => ({
    Link: ({ children, href, ...props }) => ({
      $$typeof: Symbol.for('react.element'),
      type: 'a',
      props: { href, ...props, children },
      key: null,
      ref: null,
    }),
    redirect: jest.fn(),
    usePathname: () => '/ja',
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'ja' }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/ja',
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { src, alt, ...rest } = props
    return {
      $$typeof: Symbol.for('react.element'),
      type: 'img',
      props: { src, alt, ...rest },
      key: null,
      ref: null,
    }
  },
}))

// Setup fetch mock
global.fetch = jest.fn()

// Mock NextRequest and NextResponse for API route testing
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url, options = {}) {
      this._url = url
      this.method = options.method || 'GET'
      this.headers = new Map()
      this._body = options.body
      
      // Set headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value)
        })
      }
    }
    
    get url() {
      return this._url
    }
    
    async json() {
      return JSON.parse(this._body || '{}')
    }
    
    async text() {
      return this._body || ''
    }
  },
  NextResponse: {
    json: (body, options = {}) => ({
      json: async () => body,
      status: options.status || 200,
      headers: new Map()
    })
  }
}))

// Remove the conflicting Request/Response mocks
// global.Request and global.Response are not needed when mocking Next.js components

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
