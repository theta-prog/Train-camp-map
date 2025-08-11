import { Campsite, SearchFilters } from '@/types/campsite'
import { extractPrice, filterCampsites } from '../campsiteUtils'

const mockCampsites: Campsite[] = [
  {
    id: '1',
    name: '山のキャンプ場',
    lat: 35.6762,
    lng: 139.6503,
    address: '東京都渋谷区',
    phone: '03-1234-5678',
    website: 'https://mountain.com',
    price: '¥2,000/泊',
    nearestStation: '渋谷駅',
    accessTime: '徒歩15分',
    description: '美しい山の景色',
    facilities: ['restroom', 'shower', 'parking'],
    activities: ['hiking', 'fishing'],
    images: []
  },
  {
    id: '2',
    name: '海のキャンプ場',
    lat: 35.4437,
    lng: 139.6380,
    address: '神奈川県横浜市',
    phone: '045-1234-5678',
    website: 'https://beach.com',
    price: '¥3,500/泊',
    nearestStation: '横浜駅',
    accessTime: 'バス20分',
    description: '海辺のキャンプ場',
    facilities: ['restroom', 'wifi'],
    activities: ['swimming', 'surfing'],
    images: []
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
      expect(result[0]!.name).toBe('山のキャンプ場')
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
      expect(result[0]!.name).toBe('山のキャンプ場')
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
      expect(result[0]!.name).toBe('海のキャンプ場')
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
