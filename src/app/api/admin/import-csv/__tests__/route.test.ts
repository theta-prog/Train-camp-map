import { NextRequest } from 'next/server'

// Mock FormData and File for Node.js environment
class MockFile extends File {
  content: string

  constructor(chunks: string[], filename: string, options: { type: string }) {
    // Create a minimal File-like object
    super([], filename, options)
    this.content = chunks.join('')
  }

  override async text(): Promise<string> {
    return Promise.resolve(this.content)
  }

  override stream() {
    const content = this.content
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(content))
        controller.close()
      }
    })
  }

  override arrayBuffer() {
    return Promise.resolve(new TextEncoder().encode(this.content).buffer)
  }
}

// Override the global File constructor in tests
const OriginalFile = global.File
beforeAll(() => {
  global.File = MockFile as any
})

afterAll(() => {
  global.File = OriginalFile
})

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: [], error: null })
    }))
  }))
}))

// Mock facilityMapper
jest.mock('@/utils/facilityMapper', () => ({
  mapActivityToTranslationKey: jest.fn((activity: string) => activity.toLowerCase()),
  mapFacilityToTranslationKey: jest.fn((facility: string) => facility.toLowerCase())
}))

// Import the route after mocking
import { POST } from '../route'

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  jest.clearAllMocks()
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key'
  }
})

afterEach(() => {
  process.env = originalEnv
})

describe('/api/admin/import-csv', () => {
  describe('POST', () => {
    it('CSVファイルが無い場合、400エラーを返す', async () => {
      const formData = new FormData()
      const request = {
        formData: jest.fn().mockResolvedValue(formData)
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('CSVファイルが見つかりません')
    })

    it('空のCSVファイルを処理する', async () => {
      const csvContent = ''

      const file = new MockFile([csvContent], 'test.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('csv', file)

      const request = {
        formData: jest.fn().mockResolvedValue(formData)
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(0)
      expect(data.errors).toHaveLength(0)
    })

    it('一般的なエラーの場合、500エラーを返す', async () => {
      // formDataメソッドが存在しないrequestオブジェクトでエラーを発生させる
      const request = {
        formData: undefined
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('CSVインポートに失敗しました')
    })

    it('バリデーションエラーがある行をスキップする', async () => {
      const csvContent = `name_ja,name_en,address_ja,address_en,lat,lng,price,nearest_station_ja,nearest_station_en,access_time_ja,access_time_en,description_ja,description_en,amenities,activities
,Test Campsite,東京都千代田区,Chiyoda Tokyo,35.6762,139.6503,5000,東京駅,Tokyo Station,徒歩10分,10 min walk,美しいキャンプ場,Beautiful campsite,トイレ・シャワー,ハイキング・釣り
テストキャンプ場2,Test Campsite 2,,Chiyoda Tokyo,35.6762,139.6503,5000,東京駅,Tokyo Station,徒歩10分,10 min walk,美しいキャンプ場,Beautiful campsite,トイレ・シャワー,ハイキング・釣り`

      const file = new MockFile([csvContent], 'test.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('csv', file)

      const request = {
        formData: jest.fn().mockResolvedValue(formData)
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(0)
      expect(data.errors).toHaveLength(2)
      expect(data.errors[0].message).toBe('名前（日本語）が必要です')
      expect(data.errors[1].message).toBe('住所（日本語）が必要です')
    })

    it('無効な緯度経度を処理する', async () => {
      const csvContent = `name_ja,name_en,address_ja,address_en,lat,lng,price,nearest_station_ja,nearest_station_en,access_time_ja,access_time_en,description_ja,description_en,amenities,activities
テストキャンプ場,Test Campsite,東京都千代田区,Chiyoda Tokyo,invalid,139.6503,5000,東京駅,Tokyo Station,徒歩10分,10 min walk,美しいキャンプ場,Beautiful campsite,トイレ・シャワー,ハイキング・釣り
テストキャンプ場2,Test Campsite 2,東京都千代田区,Chiyoda Tokyo,35.6762,invalid,5000,東京駅,Tokyo Station,徒歩10分,10 min walk,美しいキャンプ場,Beautiful campsite,トイレ・シャワー,ハイキング・釣り`

      const file = new MockFile([csvContent], 'test.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('csv', file)

      const request = {
        formData: jest.fn().mockResolvedValue(formData)
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(0)
      expect(data.errors).toHaveLength(2)
      expect(data.errors[0].message).toBe('緯度が無効です')
      expect(data.errors[1].message).toBe('経度が無効です')
    })

    it('無効な料金を処理する', async () => {
      const csvContent = `name_ja,name_en,address_ja,address_en,lat,lng,price,nearest_station_ja,nearest_station_en,access_time_ja,access_time_en,description_ja,description_en,amenities,activities
テストキャンプ場,Test Campsite,東京都千代田区,Chiyoda Tokyo,35.6762,139.6503,invalid,東京駅,Tokyo Station,徒歩10分,10 min walk,美しいキャンプ場,Beautiful campsite,トイレ・シャワー,ハイキング・釣り`

      const file = new MockFile([csvContent], 'test.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('csv', file)

      const request = {
        formData: jest.fn().mockResolvedValue(formData)
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(0)
      expect(data.errors).toHaveLength(1)
      expect(data.errors[0].message).toBe('料金が無効です')
    })
  })
})
