import {
    formatCampsiteForClient,
    formatCampsiteForDb,
    jsonToArray
} from '../database-helpers'

// モック環境変数
const originalEnv = process.env.DATABASE_URL

describe('database-helpers', () => {
  afterEach(() => {
    process.env.DATABASE_URL = originalEnv
  })

  describe('jsonToArray', () => {
    it('should convert JSON string to array', () => {
      const jsonString = '["facility1", "facility2"]'
      const result = jsonToArray(jsonString)
      expect(result).toEqual(['facility1', 'facility2'])
    })

    it('should handle empty JSON string', () => {
      const result = jsonToArray('')
      expect(result).toEqual([])
    })

    it('should handle invalid JSON string', () => {
      const result = jsonToArray('invalid-json')
      expect(result).toEqual([])
    })

    it('should handle array input (PostgreSQL case)', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@host/db'
      const array = ['facility1', 'facility2']
      const result = jsonToArray(array)
      expect(result).toEqual(['facility1', 'facility2'])
    })
  })

  describe('arrayToJson', () => {
    it('should return array for PostgreSQL', () => {
      // PostgreSQLの判定をモック
      const originalUrl = process.env.DATABASE_URL
      process.env.DATABASE_URL = 'postgresql://user:pass@host/db'
      
      // モジュールを再読み込み
      jest.resetModules()
      const { arrayToJson } = require('../database-helpers')
      
      const array = ['facility1', 'facility2']
      const result = arrayToJson(array)
      expect(result).toEqual(['facility1', 'facility2'])
      
      process.env.DATABASE_URL = originalUrl
    })

    it('should return JSON string for SQLite', () => {
      const originalUrl = process.env.DATABASE_URL
      process.env.DATABASE_URL = 'file:./dev.db'
      
      // モジュールを再読み込み
      jest.resetModules()
      const { arrayToJson } = require('../database-helpers')
      
      const array = ['facility1', 'facility2']
      const result = arrayToJson(array)
      expect(result).toBe('["facility1","facility2"]')
      
      process.env.DATABASE_URL = originalUrl
    })
  })

  describe('formatCampsiteForClient', () => {
    it('should format database campsite for client', () => {
      const dbCampsite = {
        id: '1',
        nameJa: '高尾の森わくわくビレッジ',
        nameEn: 'Takao Forest Wakuwaku Village',
        addressJa: '東京都八王子市川町55',
        addressEn: '55 Kawamachi, Hachioji, Tokyo',
        lat: 35.6328,
        lng: 139.2644,
        phone: '042-691-1166',
        website: 'https://www.wakuwaku-village.com/',
        price: '¥2,000-¥4,000/泊',
        facilities: ['toilet', 'shower', 'kitchen'],
        activities: ['hiking', 'bbq'],
        nearestStationJa: 'JR高尾駅',
        accessTimeJa: 'バス15分',
        descriptionJa: '高尾山の麓にある自然豊かなキャンプ場',
        images: ['image1.jpg', 'image2.jpg'],
        priceMin: 2000,
        priceMax: 4000,
        reservationUrl: 'https://example.com/reserve',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicyJa: 'キャンセル料あり',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      const result = formatCampsiteForClient(dbCampsite)

      expect(result).toEqual({
        id: '1',
        name: '高尾の森わくわくビレッジ',
        lat: 35.6328,
        lng: 139.2644,
        address: '東京都八王子市川町55',
        phone: '042-691-1166',
        website: 'https://www.wakuwaku-village.com/',
        reservationUrl: 'https://example.com/reserve',
        price: '¥2,000-¥4,000/泊',
        priceMin: 2000,
        priceMax: 4000,
        facilities: ['toilet', 'shower', 'kitchen'],
        activities: ['hiking', 'bbq'],
        nearestStation: 'JR高尾駅',
        accessTime: 'バス15分',
        description: '高尾山の麓にある自然豊かなキャンプ場',
        images: ['image1.jpg', 'image2.jpg'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'キャンセル料あり',
        nameEn: 'Takao Forest Wakuwaku Village',
        addressEn: '55 Kawamachi, Hachioji, Tokyo',
        nearestStationEn: undefined,
        accessTimeEn: undefined,
        descriptionEn: undefined,
        cancellationPolicyEn: undefined,
        reservationPhone: undefined,
        reservationEmail: undefined,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      })
    })
  })

  describe('formatCampsiteForDb', () => {
    it('should format client data for database', () => {
      const clientData = {
        name: '高尾の森わくわくビレッジ',
        address: '東京都八王子市川町55',
        lat: 35.6328,
        lng: 139.2644,
        phone: '042-691-1166',
        website: 'https://www.wakuwaku-village.com/',
        price: '¥2,000-¥4,000/泊',
        facilities: ['toilet', 'shower', 'kitchen'],
        activities: ['hiking', 'bbq'],
        nearestStation: 'JR高尾駅',
        accessTime: 'バス15分',
        description: '高尾山の麓にある自然豊かなキャンプ場',
        images: ['image1.jpg', 'image2.jpg'],
        priceMin: 2000,
        priceMax: 4000
      }

      const result = formatCampsiteForDb(clientData)

      expect(result.nameJa).toBe('高尾の森わくわくビレッジ')
      expect(result.addressJa).toBe('東京都八王子市川町55')
      expect(result.nearestStationJa).toBe('JR高尾駅')
      expect(result.accessTimeJa).toBe('バス15分')
      expect(result.descriptionJa).toBe('高尾山の麓にある自然豊かなキャンプ場')
      expect(result.lat).toBe(35.6328)
      expect(result.lng).toBe(139.2644)
    })

    it('should handle existing Ja fields', () => {
      const dbData = {
        nameJa: '高尾の森わくわくビレッジ',
        nameEn: 'Takao Forest',
        addressJa: '東京都八王子市川町55',
        lat: 35.6328,
        lng: 139.2644,
        facilities: ['toilet'],
        activities: ['hiking']
      }

      const result = formatCampsiteForDb(dbData)

      expect(result.nameJa).toBe('高尾の森わくわくビレッジ')
      expect(result.nameEn).toBe('Takao Forest')
      expect(result.addressJa).toBe('東京都八王子市川町55')
    })
  })
})
