import { DELETE, GET, PUT } from '@/app/api/campsites/[id]/route'
import { NextRequest } from 'next/server'

// jest.mockをインポートよりも先に定義
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: '1',
              name_ja: 'テストキャンプ場',
              lat: 35.6762,
              lng: 139.6503,
            },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: {
                id: '1',
                name_ja: '更新されたキャンプ場',
                lat: 35.6762,
                lng: 139.6503,
              },
              error: null
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}))

// モック参照を取得
const { supabase: mockSupabase } = require('@/lib/supabase')

describe('/api/campsites/[id]', () => {
  const params = { id: '1' }

  beforeEach(() => {
    // デフォルトのモック設定をリセット
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: '1',
              name_ja: 'テストキャンプ場',
              lat: 35.6762,
              lng: 139.6503,
            },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: {
                id: '1',
                name_ja: '更新されたキャンプ場',
                lat: 35.6762,
                lng: 139.6503,
              },
              error: null
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      }))
    })
  })

  describe('GET', () => {
    it('個別キャンプ場を正常に取得', async () => {
      const request = new NextRequest('http://localhost:3000/api/campsites/1')
      const response = await GET(request, { params })
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toHaveProperty('data')
      expect(json.data).toHaveProperty('id', '1')
      expect(json.data).toHaveProperty('name')
      expect(json.data.name).toHaveProperty('ja', 'テストキャンプ場')
    })

    it('存在しないキャンプ場で404エラー', async () => {
      // データが見つからない場合のモック
      (mockSupabase.from as jest.Mock).mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => ({
              data: null,
              error: { code: 'PGRST116' }
            })
          })
        })
      })

      const request = new NextRequest('http://localhost:3000/api/campsites/999')
      const response = await GET(request, { params: { id: '999' } })
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json).toHaveProperty('error', 'キャンプ場が見つかりません')
    })

    it('データベースエラーで500エラー', async () => {
      // データベースエラーのモック
      (mockSupabase.from as jest.Mock).mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => ({
              data: null,
              error: { code: 'OTHER_ERROR', message: 'Database error' }
            })
          })
        })
      })

      const request = new NextRequest('http://localhost:3000/api/campsites/1')
      const response = await GET(request, { params })
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toHaveProperty('error', 'キャンプ場の取得に失敗しました')
    })
  })

  describe('PUT', () => {
    const validUpdateData = {
      name_ja: '更新されたキャンプ場',
      lat: 35.6762,
      lng: 139.6503,
      address_ja: '東京都新宿区',
      price: '¥3,000/泊',
      nearest_station_ja: 'JR新宿駅',
      access_time_ja: '徒歩10分',
      description_ja: '更新されたキャンプ場です',
      facilities: ['restroom'],
      activities: ['hiking'],
    }

    it('キャンプ場を正常に更新', async () => {
      const request = new NextRequest('http://localhost:3000/api/campsites/1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params })
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toHaveProperty('data')
      expect(json.data).toHaveProperty('name_ja', '更新されたキャンプ場')
    })

    it('存在しないキャンプ場の更新で404エラー', async () => {
      // 更新対象が見つからない場合のモック
      (mockSupabase.from as jest.Mock).mockReturnValue({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({
                data: null,
                error: { code: 'PGRST116' }
              })
            })
          })
        })
      })

      const request = new NextRequest('http://localhost:3000/api/campsites/999', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params: { id: '999' } })
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json).toHaveProperty('error', 'キャンプ場が見つかりません')
    })

    it('無効なデータでバリデーションエラー', async () => {
      const invalidData = {
        name_ja: '', // 必須フィールドが空
        lat: 35.6762,
        lng: 139.6503,
      }

      const request = new NextRequest('http://localhost:3000/api/campsites/1', {
        method: 'PUT',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params })
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json).toHaveProperty('error', 'バリデーションエラー')
      expect(json).toHaveProperty('details')
    })

    it('データベースエラーで500エラー', async () => {
      // データベースエラーのモック
      (mockSupabase.from as jest.Mock).mockReturnValue({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({
                data: null,
                error: { code: 'OTHER_ERROR', message: 'Database error' }
              })
            })
          })
        })
      })

      const request = new NextRequest('http://localhost:3000/api/campsites/1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await PUT(request, { params })
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toHaveProperty('error', 'キャンプ場の更新に失敗しました')
    })
  })

  describe('DELETE', () => {
    it('キャンプ場を正常に削除', async () => {
      const request = new NextRequest('http://localhost:3000/api/campsites/1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params })
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json).toHaveProperty('message', 'キャンプ場を削除しました')
    })

    it('データベースエラーで500エラー', async () => {
      // データベースエラーのモック
      (mockSupabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            error: { message: 'Database error' }
          }))
        }))
      })

      const request = new NextRequest('http://localhost:3000/api/campsites/1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params })
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toHaveProperty('error', 'キャンプ場の削除に失敗しました')
    })
  })
})