import { GET, POST } from '@/app/api/campsites/route'
import { NextRequest } from 'next/server'

// Supabaseクライアントをモック
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [
            {
              id: '1',
              name_ja: 'テストキャンプ場',
              name_en: 'Test Campsite',
              lat: 35.6762,
              lng: 139.6503,
              address_ja: '東京都渋谷区',
              price: '¥2,000/泊',
              facilities: ['restroom', 'shower'],
              activities: ['hiking'],
            }
          ],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: '2',
              name_ja: '新規キャンプ場',
              lat: 35.6762,
              lng: 139.6503,
            },
            error: null
          }))
        }))
      }))
    }))
  }
}))

describe('/api/campsites', () => {
  describe('GET', () => {
    it('キャンプ場一覧を正常に取得', async () => {
      const response = await GET()
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toHaveProperty('data')
      expect(Array.isArray(json.data)).toBe(true)
      expect(json.data).toHaveLength(1)
      expect(json.data[0]).toHaveProperty('name')
      expect(json.data[0].name).toHaveProperty('ja', 'テストキャンプ場')
    })
  })

  describe('POST', () => {
    const validCampsiteData = {
      name_ja: '新規テストキャンプ場',
      lat: 35.6762,
      lng: 139.6503,
      address_ja: '東京都新宿区',
      price: '¥3,000/泊',
      nearest_station_ja: 'JR新宿駅',
      access_time_ja: '徒歩10分',
      description_ja: '新規作成のテストキャンプ場です',
      facilities: ['restroom'],
      activities: ['hiking'],
    }

    it('有効なデータでキャンプ場を正常に作成', async () => {
      const request = new NextRequest('http://localhost:3000/api/campsites', {
        method: 'POST',
        body: JSON.stringify(validCampsiteData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(201)
      expect(json).toHaveProperty('data')
      expect(json.data).toHaveProperty('id')
    })

    it('無効なデータでバリデーションエラー', async () => {
      const invalidData = {
        name_ja: '', // 必須フィールドが空
        lat: 35.6762,
        lng: 139.6503,
      }

      const request = new NextRequest('http://localhost:3000/api/campsites', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toHaveProperty('error', 'バリデーションエラー')
      expect(json).toHaveProperty('details')
    })

    it('無効なJSONでエラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/campsites', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toHaveProperty('error', '無効なJSONデータです')
    })
  })
})

// エラーケースのテスト用にSupabaseエラーをモック
describe('/api/campsites - エラーケース', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('データベースエラー時に適切なエラーレスポンス', async () => {
    // Supabaseエラーをモック
    const mockSupabase = require('@/lib/supabase').supabase
    mockSupabase.from.mockReturnValue({
      select: () => ({
        order: () => ({
          data: null,
          error: { message: 'Database connection failed' }
        })
      })
    })

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toHaveProperty('error', 'キャンプ場の取得に失敗しました')
  })
})
