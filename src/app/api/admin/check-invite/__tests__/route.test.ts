import { NextRequest } from 'next/server'
import { POST } from '../route'

describe('/api/admin/check-invite', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('有効な招待コードの場合、200を返す', async () => {
    process.env.ADMIN_INVITE_CODES = 'CODE123,INVITE456'

    const request = new NextRequest('http://localhost:3000/api/admin/check-invite', {
      method: 'POST',
      body: JSON.stringify({ inviteCode: 'CODE123' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.valid).toBe(true)
  })

  it('無効な招待コードの場合、有効でないことを返す', async () => {
    process.env.ADMIN_INVITE_CODES = 'CODE123,INVITE456'

    const request = new NextRequest('http://localhost:3000/api/admin/check-invite', {
      method: 'POST',
      body: JSON.stringify({ inviteCode: 'INVALID' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.valid).toBe(false)
  })

  it('招待コードが提供されない場合、400を返す', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/check-invite', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('招待コードが必要です')
  })

  it('環境変数が設定されていない場合、500を返す', async () => {
    delete process.env.ADMIN_INVITE_CODES

    const request = new NextRequest('http://localhost:3000/api/admin/check-invite', {
      method: 'POST',
      body: JSON.stringify({ inviteCode: 'ANY_CODE' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('招待コードが設定されていません')
  })

  it('JSONパースエラーの場合、500を返す', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/check-invite', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
  })
})
