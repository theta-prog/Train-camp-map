import { getAuthFromRequest } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

// GET /api/auth/me - 認証状態確認
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request)

    if (!auth) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: auth.userId,
        email: auth.email,
        role: auth.role
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: '認証状態の確認に失敗しました' },
      { status: 500 }
    )
  }
}
