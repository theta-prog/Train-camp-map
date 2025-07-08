'use client'

import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import CampsiteDetail from '@/components/CampsiteDetail'
import { Campsite } from '@/types/campsite'
import '@testing-library/jest-dom'

// next-intlのモック
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'campsiteDetail.backToList': '一覧に戻る',
      'campsiteDetail.description': '説明',
      'campsiteDetail.facilities': '設備',
      'campsiteDetail.activities': 'アクティビティ',
      'campsiteDetail.access': 'アクセス',
      'campsiteDetail.nearestStation': '最寄り駅',
      'campsiteDetail.accessTime': 'アクセス時間',
      'campsiteDetail.price': '料金',
      'campsiteDetail.phone': '電話番号',
      'campsiteDetail.website': 'ウェブサイト',
      'campsiteDetail.mapTitle': '地図',
      'campsiteDetail.noDescription': '説明はありません',
      'campsiteDetail.noFacilities': '設備情報はありません',
      'campsiteDetail.noActivities': 'アクティビティ情報はありません',
      'campsiteDetail.noPhone': '電話番号の記載はありません',
      'campsiteDetail.noWebsite': 'ウェブサイトの記載はありません',
      'facilities.restroom': 'トイレ',
      'facilities.shower': 'シャワー',
      'facilities.parking': '駐車場',
      'activities.hiking': 'ハイキング',
      'activities.fishing': '釣り',
    }
    return translations[key] || key
  }
}))

// next/navigationのモック
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

// Google Maps関連をモック
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: () => <div data-testid="google-map">Google Map Mock</div>,
  AdvancedMarker: () => <div data-testid="map-marker">Map Marker Mock</div>,
}))

// LanguageSwitcherをモック
jest.mock('../LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="language-switcher">Language Switcher Mock</div>
  }
})

const mockCampsite: Campsite = {
  id: '1',
  name: {
    ja: 'テストキャンプ場',
    en: 'Test Campsite'
  },
  lat: 35.6762,
  lng: 139.6503,
  address: {
    ja: '東京都渋谷区',
    en: 'Shibuya, Tokyo'
  },
  description: {
    ja: 'テストキャンプ場の説明です',
    en: 'Test campsite description'
  },
  facilities: ['restroom', 'shower', 'parking'],
  activities: ['hiking', 'fishing'],
  nearestStation: {
    ja: 'JR渋谷駅',
    en: 'JR Shibuya Station'
  },
  accessTime: {
    ja: '徒歩15分',
    en: '15 min walk'
  },
  price: '¥2,000/泊',
  phone: '03-1234-5678',
  website: 'https://example.com',
  images: ['image1.jpg', 'image2.jpg']
}

describe('CampsiteDetail', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ locale: 'ja' })
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
  })

  it('コンポーネントが正しく表示される（日本語）', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('テストキャンプ場')).toBeInTheDocument()
    // 複数の「東京都渋谷区」があるため、getAllByTextを使用
    const addressElements = screen.getAllByText('東京都渋谷区')
    expect(addressElements).toHaveLength(2) // ヘッダーと詳細セクションに表示
    expect(screen.getByText('← 一覧に戻る')).toBeInTheDocument() // 実際のテキストは「← 一覧に戻る」
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
  })

  it('コンポーネントが正しく表示される（英語）', () => {
    (useParams as jest.Mock).mockReturnValue({ locale: 'en' })
    
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('Test Campsite')).toBeInTheDocument()
    // 英語モードでは英語の住所が表示される
    const addressElements = screen.getAllByText(/Shibuya/)
    expect(addressElements.length).toBeGreaterThan(0)
  })

  it('説明が表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('テストキャンプ場の説明です')).toBeInTheDocument()
  })

  it('設備情報が表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('トイレ')).toBeInTheDocument()
    expect(screen.getByText('シャワー')).toBeInTheDocument()
    expect(screen.getByText('駐車場')).toBeInTheDocument()
  })

  it('アクティビティが表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('ハイキング')).toBeInTheDocument()
    expect(screen.getByText('釣り')).toBeInTheDocument()
  })

  it('アクセス情報が表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('JR渋谷駅')).toBeInTheDocument()
    expect(screen.getByText('徒歩15分')).toBeInTheDocument()
  })

  it('連絡先情報が表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('¥2,000/泊')).toBeInTheDocument()
    expect(screen.getByText('03-1234-5678')).toBeInTheDocument()
    // 実際のリンクテキストで検索
    const websiteLink = screen.getByRole('link', { name: /campsiteDetail\.officialWebsite/ })
    expect(websiteLink).toHaveAttribute('href', 'https://example.com')
  })

  it('地図が表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByTestId('google-map')).toBeInTheDocument()
    // マーカーは mocked コンポーネント内にあるため直接テストしない
  })

  it('データが不足している場合のフォールバック表示', () => {
    const incompleteCampsite: Campsite = {
      id: '2',
      name: { ja: '不完全キャンプ場', en: 'Incomplete Campsite' },
      lat: 35.6762,
      lng: 139.6503,
      address: { ja: '', en: '' },
      description: { ja: '', en: '' },
      facilities: [],
      activities: [],
      nearestStation: { ja: '', en: '' },
      accessTime: { ja: '', en: '' },
      price: '',
      phone: '',
      website: '',
      images: []
    }

    render(<CampsiteDetail campsite={incompleteCampsite} />)

    expect(screen.getByText('不完全キャンプ場')).toBeInTheDocument()
  })

  it('ローカルがない場合はjaがデフォルトになる', () => {
    (useParams as jest.Mock).mockReturnValue({})
    
    render(<CampsiteDetail campsite={mockCampsite} />)

    expect(screen.getByText('テストキャンプ場')).toBeInTheDocument()
  })

  it('画像がある場合は画像セクションが表示される', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    // 画像要素が存在することを確認（実際の画像表示はImage componentが担当）
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('画像がない場合は画像セクションが表示されない', () => {
    const campsiteWithoutImages = {
      ...mockCampsite,
      images: []
    }

    render(<CampsiteDetail campsite={campsiteWithoutImages} />)

    // 画像セクションがないことを確認
    const images = screen.queryAllByRole('img')
    expect(images).toHaveLength(0)
  })

  it('戻るリンクが正しく設定されている', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    const backLink = screen.getByRole('link', { name: '← 一覧に戻る' })
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('外部ウェブサイトリンクが正しく設定されている', () => {
    render(<CampsiteDetail campsite={mockCampsite} />)

    // 翻訳キーで検索（実際のテキスト内容で検索）
    const websiteLink = screen.getByRole('link', { name: /campsiteDetail\.officialWebsite/ })
    expect(websiteLink).toHaveAttribute('href', 'https://example.com')
    expect(websiteLink).toHaveAttribute('target', '_blank')
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
