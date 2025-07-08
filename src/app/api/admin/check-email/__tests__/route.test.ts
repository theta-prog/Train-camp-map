import { NextRequest } from 'next/server'
import { POST } from '../route'

describe('/api/admin/check-email', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('有効なメールアドレスの場合、200を返す', async () => {
    process.env.ADMIN_ALLOWED_EMAILS = 'test@example.com,admin@example.com'

    const request = new NextRequest('http://localhost:3000/api/admin/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@example.com' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.allowed).toBe(true)
  })

  it('存在しないメールアドレスの場合、許可されないことを返す', async () => {
    process.env.ADMIN_ALLOWED_EMAILS = 'admin@example.com,other@example.com'

    const request = new NextRequest('http://localhost:3000/api/admin/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@example.com' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.allowed).toBe(false)
  })

  it('メールアドレスが提供されない場合、400を返す', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/check-email', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('メールアドレスが必要です')
  })

  it('環境変数が設定されていない場合、許可される', async () => {
    delete process.env.ADMIN_ALLOWED_EMAILS

    const request = new NextRequest('http://localhost:3000/api/admin/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'any@example.com' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.allowed).toBe(true)
  })

  it('JSONパースエラーの場合、500を返す', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/check-email', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('メールアドレスのチェックに失敗しました')
  })
})