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

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
