import { extractPriceFromString, fetchCampsites, transformApiCampsiteToFrontend } from '../campsiteApi'

// fetch APIをモック
global.fetch = jest.fn()

describe('campsiteApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('transformApiCampsiteToFrontend', () => {
    it('should handle new API response format (already formatted)', () => {
      const apiCampsite = {
        id: '1',
        name: 'テストキャンプ場',
        lat: 35.6762,
        lng: 139.6503,
        address: '東京都',
        phone: '03-1234-5678',
        website: 'https://test.com',
        price: '¥3000/泊',
        facilities: ['restroom', 'parking'],
        activities: ['hiking'],
        nearestStation: '新宿駅',
        accessTime: '徒歩10分',
        description: 'テスト用キャンプ場',
        images: [],
        priceMin: 3000,
        priceMax: 3000,
        reservationUrl: 'https://test.com/reserve',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'キャンセル料あり'
      }

      const result = transformApiCampsiteToFrontend(apiCampsite)

      expect(result).toEqual({
        id: '1',
        name: 'テストキャンプ場',
        lat: 35.6762,
        lng: 139.6503,
        address: '東京都',
        phone: '03-1234-5678',
        website: 'https://test.com',
        reservationUrl: 'https://test.com/reserve',
        price: '¥3000/泊',
        priceMin: 3000,
        priceMax: 3000,
        facilities: ['restroom', 'parking'],
        activities: ['hiking'],
        nearestStation: '新宿駅',
        accessTime: '徒歩10分',
        description: 'テスト用キャンプ場',
        images: [],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'キャンセル料あり'
      })
    })

    it('should handle old API response format (with Ja suffixes)', () => {
      const apiCampsite = {
        id: '1',
        nameJa: 'テストキャンプ場',
        nameEn: 'Test Campsite',
        lat: 35.6762,
        lng: 139.6503,
        addressJa: '東京都',
        addressEn: 'Tokyo',
        phone: '03-1234-5678',
        website: 'https://test.com',
        price: '¥3000/泊',
        facilities: ['restroom', 'parking'],
        activities: ['hiking'],
        nearestStationJa: '新宿駅',
        nearestStationEn: 'Shinjuku Station',
        accessTimeJa: '徒歩10分',
        accessTimeEn: '10 min walk',
        descriptionJa: 'テスト用キャンプ場',
        descriptionEn: 'Test campsite',
        images: []
      }

      const result = transformApiCampsiteToFrontend(apiCampsite)

      expect(result.name).toBe('テストキャンプ場')
      expect(result.address).toBe('東京都')
      expect(result.nearestStation).toBe('新宿駅')
      expect(result.accessTime).toBe('徒歩10分')
      expect(result.description).toBe('テスト用キャンプ場')
    })

    it('should handle missing optional fields', () => {
      const apiCampsite = {
        id: '1',
        name: 'Test Camp',
        address: 'Test Address',
        lat: 35.0,
        lng: 139.0,
        price: '¥1,000/泊',
        nearestStation: 'Test Station',
        accessTime: '10分',
        description: 'Test Description'
      }

      const result = transformApiCampsiteToFrontend(apiCampsite)

      expect(result.phone).toBe('')
      expect(result.website).toBe('')
      expect(result.facilities).toEqual([])
      expect(result.activities).toEqual([])
      expect(result.images).toEqual([])
    })

    it('should handle null values for optional fields', () => {
      const apiCampsite = {
        id: '1',
        nameJa: 'テストキャンプ場',
        nameEn: 'Test Campsite',
        lat: 35.6762,
        lng: 139.6503,
        addressJa: '東京都',
        addressEn: 'Tokyo',
        phone: null,
        website: null,
        price: '¥3000/泊',
        facilities: null,
        activities: null,
        nearestStationJa: '新宿駅',
        nearestStationEn: 'Shinjuku Station',
        accessTimeJa: '徒歩10分',
        accessTimeEn: '10 min walk',
        descriptionJa: 'テスト用キャンプ場',
        descriptionEn: 'Test campsite',
        images: null
      }

      const result = transformApiCampsiteToFrontend(apiCampsite)

      expect(result.phone).toBe('')
      expect(result.website).toBe('')
      expect(result.facilities).toEqual([])
      expect(result.activities).toEqual([])
      expect(result.images).toEqual([])
    })
  })

  describe('fetchCampsites', () => {
    it('キャンプサイト一覧を正常に取得できる', async () => {
      const mockApiResponse = {
        campsites: [
          {
            id: '1',
            name: 'テストキャンプ場1',
            lat: 35.6762,
            lng: 139.6503,
            address: '東京都',
            phone: '03-1234-5678',
            website: 'https://test1.com',
            price: '¥3000/泊',
            facilities: ['restroom', 'parking'],
            activities: ['hiking'],
            nearestStation: '新宿駅',
            accessTime: '徒歩10分',
            description: 'テスト用キャンプ場1',
            images: []
          },
          {
            id: '2',
            name: 'テストキャンプ場2',
            lat: 35.6895,
            lng: 139.6917,
            address: '東京都',
            phone: '03-1234-5679',
            website: 'https://test2.com',
            price: '¥4000/泊',
            facilities: ['restroom', 'parking', 'shower'],
            activities: ['hiking', 'cycling'],
            nearestStation: '渋谷駅',
            accessTime: '徒歩15分',
            description: 'テスト用キャンプ場2',
            images: []
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
      expect(result[0]?.name).toBe('テストキャンプ場1')
      expect(result[1]?.id).toBe('2')
      expect(result[1]?.name).toBe('テストキャンプ場2')
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

    it('campsitesが配列でない場合、エラーを投げる', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ campsites: 'not an array' })
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
