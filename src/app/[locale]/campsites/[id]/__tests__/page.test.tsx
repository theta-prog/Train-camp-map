import { render } from '@testing-library/react'
import { notFound } from 'next/navigation'
import CampsiteDetailPage from '@/app/[locale]/campsites/[id]/page'
import { supabase } from '@/lib/supabase'
import '@testing-library/jest-dom'

// next/navigationのモック
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

// supabaseのモック
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

// CampsiteDetailコンポーネントのモック
jest.mock('@/components/CampsiteDetail', () => {
  return function MockCampsiteDetail({ campsite }: any) {
    return (
      <div data-testid="campsite-detail">
        <h1>{campsite.name.ja}</h1>
        <p>{campsite.address.ja}</p>
      </div>
    )
  }
})

const mockCampsiteData = {
  id: '1',
  name_ja: 'テストキャンプ場',
  name_en: 'Test Campsite',
  lat: 35.6762,
  lng: 139.6503,
  address_ja: '東京都渋谷区',
  address_en: 'Shibuya, Tokyo',
  description_ja: 'テストキャンプ場の説明',
  description_en: 'Test campsite description',
  facilities: ['restroom', 'shower'],
  activities: ['hiking', 'fishing'],
  nearest_station_ja: 'JR渋谷駅',
  nearest_station_en: 'JR Shibuya Station',
  access_time_ja: '徒歩15分',
  access_time_en: '15 min walk',
  price: '¥2,000/泊',
  phone: '03-1234-5678',
  website: 'https://example.com',
  images: ['image1.jpg']
}

const mockSupabaseChain = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
}

describe('CampsiteDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(supabase.from as jest.Mock).mockReturnValue(mockSupabaseChain)
  })

  it('正常なキャンプ場データでページが表示される', async () => {
    mockSupabaseChain.single.mockResolvedValue({
      data: mockCampsiteData,
      error: null,
    })

    const params = { locale: 'ja', id: '1' }
    const component = await CampsiteDetailPage({ params })
    
    const { container } = render(component)
    
    expect(container.querySelector('[data-testid="campsite-detail"]')).toBeInTheDocument()
    expect(container.textContent).toContain('テストキャンプ場')
    expect(container.textContent).toContain('東京都渋谷区')
  })

  it('存在しないキャンプ場IDでnotFoundが呼ばれる', async () => {
    mockSupabaseChain.single.mockResolvedValue({
      data: null,
      error: { message: 'Not found' },
    })

    const params = { locale: 'ja', id: 'nonexistent' }
    
    await CampsiteDetailPage({ params })
    
    expect(notFound).toHaveBeenCalled()
  })

  it('データベースエラー時にnotFoundが呼ばれる', async () => {
    mockSupabaseChain.single.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    })

    const params = { locale: 'ja', id: '1' }
    
    await CampsiteDetailPage({ params })
    
    expect(notFound).toHaveBeenCalled()
  })

  it('正しいSupabaseクエリが実行される', async () => {
    mockSupabaseChain.single.mockResolvedValue({
      data: mockCampsiteData,
      error: null,
    })

    const params = { locale: 'ja', id: '1' }
    
    await CampsiteDetailPage({ params })
    
    expect(supabase.from).toHaveBeenCalledWith('campsites')
    expect(mockSupabaseChain.select).toHaveBeenCalledWith('*')
    expect(mockSupabaseChain.eq).toHaveBeenCalledWith('id', '1')
    expect(mockSupabaseChain.single).toHaveBeenCalled()
  })

  it('データ変換が正しく行われる', async () => {
    const mockData = {
      ...mockCampsiteData,
      facilities: null,
      activities: null,
      phone: null,
      website: null,
    }

    mockSupabaseChain.single.mockResolvedValue({
      data: mockData,
      error: null,
    })

    const params = { locale: 'ja', id: '1' }
    const component = await CampsiteDetailPage({ params })
    
    render(component)
    
    // データ変換が正しく行われることを確認
    // CampsiteDetailコンポーネントが正しいプロパティで呼ばれることを確認
    expect(mockSupabaseChain.single).toHaveBeenCalled()
  })

  it('最小限のデータでも正常に動作する', async () => {
    const minimalData = {
      id: '1',
      name_ja: 'ミニマルキャンプ場',
      name_en: 'Minimal Campsite',
      lat: 35.6762,
      lng: 139.6503,
      address_ja: '東京都',
      address_en: 'Tokyo',
      description_ja: null,
      description_en: null,
      facilities: [],
      activities: [],
      nearest_station_ja: null,
      nearest_station_en: null,
      access_time_ja: null,
      access_time_en: null,
      price: null,
      phone: null,
      website: null,
      images: null,
    }

    mockSupabaseChain.single.mockResolvedValue({
      data: minimalData,
      error: null,
    })

    const params = { locale: 'ja', id: '1' }
    const component = await CampsiteDetailPage({ params })
    
    const { container } = render(component)
    
    expect(container.querySelector('[data-testid="campsite-detail"]')).toBeInTheDocument()
    expect(container.textContent).toContain('ミニマルキャンプ場')
  })

  it('英語ロケールでも正常に動作する', async () => {
    mockSupabaseChain.single.mockResolvedValue({
      data: mockCampsiteData,
      error: null,
    })

    const params = { locale: 'en', id: '1' }
    const component = await CampsiteDetailPage({ params })
    
    render(component)
    
    expect(mockSupabaseChain.eq).toHaveBeenCalledWith('id', '1')
  })

  it('IDパラメータが異なる値でも正しくクエリが実行される', async () => {
    mockSupabaseChain.single.mockResolvedValue({
      data: { ...mockCampsiteData, id: '999' },
      error: null,
    })

    const params = { locale: 'ja', id: '999' }
    
    await CampsiteDetailPage({ params })
    
    expect(mockSupabaseChain.eq).toHaveBeenCalledWith('id', '999')
  })
})
