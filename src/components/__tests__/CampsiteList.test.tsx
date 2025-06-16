import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CampsiteList from '../CampsiteList'
import { Campsite } from '@/types/campsite'

// モックデータ
const mockCampsites: Campsite[] = [
  {
    id: '1',
    name: { ja: 'テストキャンプ場1', en: 'Test Campsite 1' },
    lat: 35.6762,
    lng: 139.6503,
    address: { ja: '東京都渋谷区', en: 'Shibuya, Tokyo' },
    phone: '03-1234-5678',
    website: 'https://test1.com',
    price: '¥2,000/泊',
    nearestStation: { ja: '渋谷駅', en: 'Shibuya Station' },
    accessTime: { ja: '徒歩15分', en: '15 min walk' },
    description: { ja: '美しい自然に囲まれたキャンプ場', en: 'Beautiful campsite surrounded by nature' },
    facilities: ['restroom', 'shower', 'parking'],
    activities: ['hiking', 'fishing'],
  }
]

describe('CampsiteList', () => {
  const mockOnCampsiteSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('キャンプ場のリストが正しく表示される', () => {
    render(
      <CampsiteList
        campsites={mockCampsites}
        onCampsiteSelect={mockOnCampsiteSelect}
        selectedCampsite={null}
      />
    )

    // タイトルが表示されることを確認
    expect(screen.getByText('Campsites (1 found)')).toBeInTheDocument()
    
    // キャンプ場名が表示されることを確認
    expect(screen.getByText('テストキャンプ場1')).toBeInTheDocument()
    
    // 価格が表示されることを確認
    expect(screen.getByText('¥2,000/泊')).toBeInTheDocument()
    
    // 住所が表示されることを確認
    expect(screen.getByText('東京都渋谷区')).toBeInTheDocument()
  })

  it('キャンプ場がない場合のメッセージが表示される', () => {
    render(
      <CampsiteList
        campsites={[]}
        onCampsiteSelect={mockOnCampsiteSelect}
        selectedCampsite={null}
      />
    )

    expect(screen.getByText('No campsites found')).toBeInTheDocument()
    expect(screen.getByText('Try changing your search filters')).toBeInTheDocument()
  })

  it('設備とアクティビティが正しく表示される', () => {
    render(
      <CampsiteList
        campsites={mockCampsites}
        onCampsiteSelect={mockOnCampsiteSelect}
        selectedCampsite={null}
      />
    )

    // 設備が表示されることを確認
    expect(screen.getByText('Restroom')).toBeInTheDocument()
    expect(screen.getByText('Shower')).toBeInTheDocument()
    expect(screen.getByText('Parking')).toBeInTheDocument()

    // アクティビティが表示されることを確認
    expect(screen.getByText('Hiking')).toBeInTheDocument()
    expect(screen.getByText('Fishing')).toBeInTheDocument()
  })

  it('詳細クリックメッセージが表示される', () => {
    render(
      <CampsiteList
        campsites={mockCampsites}
        onCampsiteSelect={mockOnCampsiteSelect}
        selectedCampsite={null}
      />
    )

    expect(screen.getByText('Click on a campsite for details')).toBeInTheDocument()
  })
})
