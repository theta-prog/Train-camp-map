import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスが必要です' },
        { status: 400 }
      )
    }

    // 許可されたメールアドレスをチェック
    const allowedEmails = process.env.ADMIN_ALLOWED_EMAILS?.split(',').map(e => e.trim()) || []
    
    // 環境変数が設定されていない場合は、開発環境では全て許可
    if (allowedEmails.length === 0) {
      console.warn('ADMIN_ALLOWED_EMAILS が設定されていません。本番環境では設定してください。')
      return NextResponse.json({ allowed: true })
    }

    const isAllowed = allowedEmails.includes(email.toLowerCase())

    return NextResponse.json({ allowed: isAllowed })
  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json(
      { error: 'メールアドレスのチェックに失敗しました' },
      { status: 500 }
    )
  }
}
