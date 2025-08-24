import { Campsite, SearchFilters } from '@/types/campsite'
import { extractPrice, filterCampsites } from '@/utils/campsiteUtils'

describe('campsiteUtils 異常系', () => {
  const mockCampsites: Campsite[] = [
    {
      id: '1',
      name: '山',
      lat: 35.0,
      lng: 139.0,
      address: 'A',
      price: '¥1000',
      phone: '',
      website: '',
      nearestStation: '',
      accessTime: '',
      description: '',
      facilities: [],
      activities: [],
      images: [],
      reservationUrl: '',
      priceMin: 1000,
      priceMax: 1000,
      checkInTime: '',
      checkOutTime: '',
      cancellationPolicy: '',
    },
  ]

  it('maxPriceが0未満でも全件返す', () => {
    const filters: SearchFilters = { keyword: '', maxPrice: -1, facilities: [], activities: [] }
    expect(filterCampsites(mockCampsites, filters)).toHaveLength(1)
  })

  it('extractPriceで不正な文字列は0', () => {
    expect(extractPrice('abc')).toBe(0)
    expect(extractPrice('')).toBe(0)
    expect(extractPrice(null as any)).toBe(0)
    expect(extractPrice(undefined as any)).toBe(0)
  })
})
