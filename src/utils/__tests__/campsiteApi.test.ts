import { extractPriceFromString, fetchCampsites, transformApiCampsiteToFrontend } from '../campsiteApi'

// fetch APIをモック
global.fetch = jest.fn()

describe('campsiteApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('transformApiCampsiteToFrontend', () => {
    it('API レスポンスをフロントエンド用の型に変換する', () => {
      const apiCampsite = {
        id: '1',
        name: { ja: 'テストキャンプ場', en: 'Test Campsite' },
        lat: 35.6762,
        lng: 139.6503,
        address: { ja: '東京都', en: 'Tokyo' },
        phone: '03-1234-5678',
        website: 'https://test.com',
        price: '¥3000/泊',
        facilities: ['restroom', 'parking'],
        activities: ['hiking'],
        nearestStation: { ja: '新宿駅', en: 'Shinjuku Station' },
        accessTime: { ja: '徒歩10分', en: '10 min walk' },
        description: { ja: 'テスト用キャンプ場', en: 'Test campsite' }
      }

      const result = transformApiCampsiteToFrontend(apiCampsite)

      expect(result).toEqual({
        id: '1',
        name: { ja: 'テストキャンプ場', en: 'Test Campsite' },
        lat: 35.6762,
        lng: 139.6503,
        address: { ja: '東京都', en: 'Tokyo' },
        phone: '03-1234-5678',
        website: 'https://test.com',
        price: '¥3000/泊',
        facilities: ['restroom', 'parking'],
        activities: ['hiking'],
        nearestStation: { ja: '新宿駅', en: 'Shinjuku Station' },
        accessTime: { ja: '徒歩10分', en: '10 min walk' },
        description: { ja: 'テスト用キャンプ場', en: 'Test campsite' }
      })
    })

    it('必須でないフィールドがnullの場合、デフォルト値を設定する', () => {
      const apiCampsite = {
        id: '1',
        name: { ja: 'テストキャンプ場', en: 'Test Campsite' },
        lat: 35.6762,
        lng: 139.6503,
        address: { ja: '東京都', en: 'Tokyo' },
        phone: null,
        website: null,
        price: '¥3000/泊',
        facilities: null,
        activities: null,
        nearestStation: { ja: '新宿駅', en: 'Shinjuku Station' },
        accessTime: { ja: '徒歩10分', en: '10 min walk' },
        description: { ja: 'テスト用キャンプ場', en: 'Test campsite' }
      }

      const result = transformApiCampsiteToFrontend(apiCampsite)

      expect(result.phone).toBe('')
      expect(result.website).toBe('')
      expect(result.facilities).toEqual([])
      expect(result.activities).toEqual([])
    })
  })

  describe('fetchCampsites', () => {
    it('キャンプサイト一覧を正常に取得できる', async () => {
      const mockApiResponse = {
        data: [
          {
            id: '1',
            name: { ja: 'テストキャンプ場1', en: 'Test Campsite 1' },
            lat: 35.6762,
            lng: 139.6503,
            address: { ja: '東京都', en: 'Tokyo' },
            phone: '03-1234-5678',
            website: 'https://test1.com',
            price: '¥3000/泊',
            facilities: ['restroom', 'parking'],
            activities: ['hiking'],
            nearestStation: { ja: '新宿駅', en: 'Shinjuku Station' },
            accessTime: { ja: '徒歩10分', en: '10 min walk' },
            description: { ja: 'テスト用キャンプ場1', en: 'Test campsite 1' }
          },
          {
            id: '2',
            name: { ja: 'テストキャンプ場2', en: 'Test Campsite 2' },
            lat: 35.6895,
            lng: 139.6917,
            address: { ja: '東京都', en: 'Tokyo' },
            phone: '03-1234-5679',
            website: 'https://test2.com',
            price: '¥4000/泊',
            facilities: ['restroom', 'parking', 'shower'],
            activities: ['hiking', 'cycling'],
            nearestStation: { ja: '渋谷駅', en: 'Shibuya Station' },
            accessTime: { ja: '徒歩15分', en: '15 min walk' },
            description: { ja: 'テスト用キャンプ場2', en: 'Test campsite 2' }
          }
        ]
      }

      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      })

      const result = await fetchCampsites()

      expect(fetch).toHaveBeenCalledWith('/api/campsites')
      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe('1')
      expect(result[0]?.name.ja).toBe('テストキャンプ場1')
      expect(result[1]?.id).toBe('2')
      expect(result[1]?.name.ja).toBe('テストキャンプ場2')
    })

    it('APIリクエストが失敗した場合、エラーを投げる', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(fetchCampsites()).rejects.toThrow('API request failed: 500')
    })

    it('無効なAPIレスポンス形式の場合、エラーを投げる', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ invalidFormat: true })
      })

      await expect(fetchCampsites()).rejects.toThrow('Invalid API response format')
    })

    it('dataが配列でない場合、エラーを投げる', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'not an array' })
      })

      await expect(fetchCampsites()).rejects.toThrow('Invalid API response format')
    })

    it('ネットワークエラーの場合、エラーを投げる', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await expect(fetchCampsites()).rejects.toThrow('Network error')
    })
  })

  describe('extractPriceFromString', () => {
    it('価格文字列から数値を正しく抽出する', () => {
      expect(extractPriceFromString('¥3000/泊')).toBe(3000)
      expect(extractPriceFromString('¥1,500円')).toBe(1500)
      expect(extractPriceFromString('価格: ¥2,000-¥5,000')).toBe(2000)
      expect(extractPriceFromString('500円/人')).toBe(500)
    })

    it('カンマ区切りの価格を正しく処理する', () => {
      expect(extractPriceFromString('¥10,000/泊')).toBe(10000)
      expect(extractPriceFromString('¥1,234,567円')).toBe(1234567)
    })

    it('数値が含まれていない場合、0を返す', () => {
      expect(extractPriceFromString('無料')).toBe(0)
      expect(extractPriceFromString('お問い合わせください')).toBe(0)
      expect(extractPriceFromString('')).toBe(0)
    })

    it('複数の数値がある場合、最初の数値を返す', () => {
      expect(extractPriceFromString('¥2,000-¥5,000/泊')).toBe(2000)
      expect(extractPriceFromString('平日1000円、休日2000円')).toBe(1000)
    })
  })
})
