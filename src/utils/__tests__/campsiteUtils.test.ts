import { filterCampsites, extractPrice } from '../campsiteUtils'
import { Campsite, SearchFilters } from '@/types/campsite'

const mockCampsites: Campsite[] = [
  {
    id: '1',
    name: { ja: '山のキャンプ場', en: 'Mountain Campsite' },
    lat: 35.6762,
    lng: 139.6503,
    address: { ja: '東京都渋谷区', en: 'Shibuya, Tokyo' },
    phone: '03-1234-5678',
    website: 'https://mountain.com',
    price: '¥2,000/泊',
    nearestStation: { ja: '渋谷駅', en: 'Shibuya Station' },
    accessTime: { ja: '徒歩15分', en: '15 min walk' },
    description: { ja: '美しい山の景色', en: 'Beautiful mountain view' },
    facilities: ['restroom', 'shower', 'parking'],
    activities: ['hiking', 'fishing'],
  },
  {
    id: '2',
    name: { ja: '海のキャンプ場', en: 'Beach Campsite' },
    lat: 35.4437,
    lng: 139.6380,
    address: { ja: '神奈川県横浜市', en: 'Yokohama, Kanagawa' },
    phone: '045-1234-5678',
    website: 'https://beach.com',
    price: '¥3,500/泊',
    nearestStation: { ja: '横浜駅', en: 'Yokohama Station' },
    accessTime: { ja: 'バス20分', en: '20 min by bus' },
    description: { ja: '海辺のキャンプ場', en: 'Beachfront camping' },
    facilities: ['restroom', 'wifi'],
    activities: ['swimming', 'surfing'],
  },
]

describe('campsiteUtils', () => {
  describe('filterCampsites', () => {
    it('キーワードでフィルタリングできる', () => {
      const filters: SearchFilters = {
        keyword: '山',
        maxPrice: 0,
        facilities: [],
        activities: [],
      }
      
      const result = filterCampsites(mockCampsites, filters)
      expect(result).toHaveLength(1)
      expect(result[0]!.name.ja).toBe('山のキャンプ場')
    })

    it('設備でフィルタリングできる', () => {
      const filters: SearchFilters = {
        keyword: '',
        maxPrice: 0,
        facilities: ['shower'],
        activities: [],
      }
      
      const result = filterCampsites(mockCampsites, filters)
      expect(result).toHaveLength(1)
      expect(result[0]!.name.ja).toBe('山のキャンプ場')
    })

    it('アクティビティでフィルタリングできる', () => {
      const filters: SearchFilters = {
        keyword: '',
        maxPrice: 0,
        facilities: [],
        activities: ['swimming'],
      }
      
      const result = filterCampsites(mockCampsites, filters)
      expect(result).toHaveLength(1)
      expect(result[0]!.name.ja).toBe('海のキャンプ場')
    })

    it('条件に合わない場合は空配列を返す', () => {
      const filters: SearchFilters = {
        keyword: '存在しない',
        maxPrice: 0,
        facilities: [],
        activities: [],
      }
      
      const result = filterCampsites(mockCampsites, filters)
      expect(result).toHaveLength(0)
    })
  })

  describe('extractPrice', () => {
    it('価格文字列から数値を抽出できる', () => {
      expect(extractPrice('¥2,000/泊')).toBe(2000)
      expect(extractPrice('¥3,500/泊')).toBe(3500)
      expect(extractPrice('¥10,000/泊')).toBe(10000)
    })

    it('数値がない場合は0を返す', () => {
      expect(extractPrice('無料')).toBe(0)
      expect(extractPrice('価格要相談')).toBe(0)
    })
  })
})
