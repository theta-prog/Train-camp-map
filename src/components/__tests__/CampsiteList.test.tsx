import { Campsite } from '@/types/campsite'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CampsiteList from '../CampsiteList'

// モック next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'campsiteList.title': 'Campsites',
      'campsiteList.count': '{{count}} found',
      'campsiteList.noResults': 'No campsites found',
      'campsiteList.changeFilters': 'Try changing your search filters',
      'campsiteList.nearestStation': 'Nearest Station',
      'campsiteList.access': 'Access',
      'campsiteList.clickForDetails': 'Click on a campsite for details',
      'facilities.restroom': 'Restroom',
      'facilities.shower': 'Shower',
      'facilities.parking': 'Parking',
      'facilities.wifi': 'WiFi',
      'facilities.bbq': 'BBQ',
      'facilities.kitchen': 'Kitchen',
      'activities.hiking': 'Hiking',
      'activities.fishing': 'Fishing',
      'activities.swimming': 'Swimming',
      'activities.cycling': 'Cycling',
      'activities.boating': 'Boating',
    }
    return translations[key] || key
  }
}))

// モック next/navigation
const mockUseParams = jest.fn()
jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams()
}))

// テストデータ
const basicCampsite: Campsite = {
  id: '1',
  name: 'テストキャンプ場1',
  lat: 35.6762,
  lng: 139.6503,
  address: '東京都渋谷区',
  phone: '03-1234-5678',
  website: 'https://test1.com',
  price: '¥2,000/泊',
  nearestStation: '渋谷駅',
  accessTime: '徒歩15分',
  description: '美しい自然に囲まれたキャンプ場',
  facilities: ['restroom', 'shower', 'parking'],
  activities: ['hiking', 'fishing'],
  images: [],
  reservationUrl: 'https://test1.com/reserve',
  priceMin: 2000,
  priceMax: 2000,
  checkInTime: '14:00',
  checkOutTime: '11:00',
  cancellationPolicy: 'キャンセル料あり',
}

const fullFeaturedCampsite: Campsite = {
  id: '2',
  name: 'フル装備キャンプ場',
  lat: 35.6762,
  lng: 139.6503,
  address: '神奈川県横浜市',
  phone: '045-1234-5678',
  website: 'https://test2.com',
  price: '¥5,000/泊',
  nearestStation: '横浜駅',
  accessTime: 'バス30分',
  description: 'すべての設備が揃った豪華キャンプ場',
  facilities: ['restroom', 'shower', 'parking', 'wifi', 'bbq', 'kitchen'], // 6つの設備（3つ以上）
  activities: ['hiking', 'fishing', 'swimming', 'cycling', 'boating'], // 5つのアクティビティ（2つ以上）
  images: [],
  reservationUrl: 'https://test2.com/reserve',
  priceMin: 5000,
  priceMax: 5000,
  checkInTime: '14:00',
  checkOutTime: '11:00',
  cancellationPolicy: 'キャンセル料あり',
}

const singleActivityCampsite: Campsite = {
  id: '3',
  name: '簡素キャンプ場',
  lat: 35.6762,
  lng: 139.6503,
  address: '千葉県市川市',
  phone: '047-1234-5678',
  website: 'https://test3.com',
  price: '¥1,500/泊',
  nearestStation: '市川駅',
  accessTime: '徒歩10分',
  description: 'シンプルなキャンプ場',
  facilities: [], // 設備なし
  activities: ['hiking'], // 1つのアクティビティ（2つ未満）
  images: [],
  reservationUrl: 'https://test3.com/reserve',
  priceMin: 1500,
  priceMax: 1500,
  checkInTime: '14:00',
  checkOutTime: '11:00',
  cancellationPolicy: 'キャンセル料あり',
}

describe('CampsiteList', () => {
  const mockOnCampsiteSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // デフォルトは日本語ロケール
    mockUseParams.mockReturnValue({ locale: 'ja' })
  })

  // スナップショットテスト - 効率的な100%UIカバレッジ
  describe('スナップショットテスト', () => {
    it('基本のキャンプ場リスト', () => {
      const { container } = render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('空のリスト', () => {
      const { container } = render(
        <CampsiteList
          campsites={[]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('選択されたキャンプ場', () => {
      const { container } = render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={basicCampsite}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('多機能キャンプ場（"+N"表示）', () => {
      const { container } = render(
        <CampsiteList
          campsites={[fullFeaturedCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('複数キャンプ場', () => {
      const { container } = render(
        <CampsiteList
          campsites={[basicCampsite, fullFeaturedCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('設備なし・アクティビティ少数', () => {
      const { container } = render(
        <CampsiteList
          campsites={[singleActivityCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('英語ロケール', () => {
      mockUseParams.mockReturnValue({ locale: 'en' })
      const { container } = render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('未定義ロケール（フォールバック）', () => {
      mockUseParams.mockReturnValue({})
      const { container } = render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('nullパラメータ（フォールバック）', () => {
      mockUseParams.mockReturnValue(null)
      const { container } = render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  // 機能テスト（スナップショットテストで100%カバー済みのため最小限）
  describe('基本機能', () => {
    it('キャンプ場クリック時にコールバック呼び出し', () => {
      render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )

      const campsiteElement = screen.getByText('テストキャンプ場1')
      campsiteElement.click()
      
      expect(mockOnCampsiteSelect).toHaveBeenCalledWith(basicCampsite)
    })

    it('空の状態メッセージが表示される', () => {
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
  })

  // エッジケースの論理テスト（スナップショットと併用）
  describe('条件分岐ロジック', () => {
    it('設備3つまでは"+N"表示なし', () => {
      render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      
      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument()
    })

    it('設備多数で"+N"表示', () => {
      render(
        <CampsiteList
          campsites={[fullFeaturedCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      
      // 設備セクション内で "+3" を検索
      const facilitiesSection = screen.getByText('Restroom').parentElement
      expect(facilitiesSection).toHaveTextContent('+3')
    })

    it('アクティビティ2つまでは"+N"表示なし', () => {
      render(
        <CampsiteList
          campsites={[singleActivityCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      
      // アクティビティセクションに "+N" なし
      const activitySection = screen.getByText('Hiking').parentElement
      expect(activitySection).not.toHaveTextContent(/^\+\d+$/)
    })

    it('アクティビティ多数で"+N"表示', () => {
      render(
        <CampsiteList
          campsites={[fullFeaturedCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      
      // アクティビティセクション内で "+3" を検索
      const activitySection = screen.getByText('Hiking').parentElement
      expect(activitySection).toHaveTextContent('+3')
    })

    it('選択状態のスタイル適用確認', () => {
      render(
        <CampsiteList
          campsites={[basicCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={basicCampsite}
        />
      )
      
      const selectedElement = screen.getByText('テストキャンプ場1').closest('div')?.parentElement
      expect(selectedElement).toHaveClass('bg-green-50')
      expect(selectedElement).toHaveClass('border-green-200')
    })

    it('空配列の設備・アクティビティでエラーなし', () => {
      render(
        <CampsiteList
          campsites={[singleActivityCampsite]}
          onCampsiteSelect={mockOnCampsiteSelect}
          selectedCampsite={null}
        />
      )
      
      // エラーなく表示されることを確認
      expect(screen.getByText('簡素キャンプ場')).toBeInTheDocument()
    })
  })
})
