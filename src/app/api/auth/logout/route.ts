import { NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

/**
 * ログアウトAPI
 * HttpOnly Cookieを削除してセキュアにログアウト
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'ログアウトしました'
    })

    // auth-tokenクッキーを削除
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // 即座に期限切れにする
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'ログアウト処理に失敗しました' },
      { status: 500 }
    )
  }
}
