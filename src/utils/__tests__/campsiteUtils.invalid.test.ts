import { Campsite, SearchFilters } from '@/types/campsite'
import { extractPrice, filterCampsites } from '@/utils/campsiteUtils'

describe('campsiteUtils 異常系', () => {
  const mockCampsites: Campsite[] = [
    {
      id: '1',
      name: { ja: '山', en: 'Mountain' },
      lat: 1,
      lng: 2,
      address: { ja: 'A', en: 'A' },
      phone: '',
      website: '',
      price: '¥1,000/泊',
      nearestStation: { ja: '', en: '' },
      accessTime: { ja: '', en: '' },
      description: { ja: '', en: '' },
      facilities: [],
      activities: [],
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
