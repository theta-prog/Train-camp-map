import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest, requireAdmin } from '@/lib/auth'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

// GET /api/admin/env-check - 環境変数の確認（管理者専用）
export async function GET(request: NextRequest) {
  try {
    // 管理者権限チェック（本番環境では必須）
    if (process.env.NODE_ENV === 'production') {
      const auth = await getAuthFromRequest(request)
      if (!requireAdmin(auth)) {
        return NextResponse.json(
          { error: '管理者権限が必要です' },
          { status: 403 }
        )
      }
    }

    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? '✅ 設定済み' : '❌ 未設定',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ 設定済み' : '❌ 未設定',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '❌ 未設定',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ 設定済み' : '❌ 未設定',
      ADMIN_ALLOWED_EMAILS: process.env.ADMIN_ALLOWED_EMAILS ? '✅ 設定済み' : '❌ 未設定',
      GOOGLE_MAPS_API: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ 設定済み' : '❌ 未設定',
      
      // データベース接続詳細（本番では一部マスク）
      databaseInfo: process.env.DATABASE_URL ? {
        provider: process.env.DATABASE_URL.includes('postgresql') ? 'PostgreSQL' : 'その他',
        host: process.env.DATABASE_URL.includes('postgresql') ? 
          process.env.DATABASE_URL.split('@')[1]?.split('/')[0]?.replace(/:\d+$/, '') || 'unknown' : 
          'unknown'
      } : null
    }

    return NextResponse.json({
      message: '環境変数チェック結果',
      environment: envCheck,
      recommendations: [
        envCheck.DATABASE_URL === '❌ 未設定' ? 'DATABASE_URLを設定してください（Vercel Postgres推奨）' : null,
        envCheck.JWT_SECRET === '❌ 未設定' ? 'JWT_SECRETを設定してください（32文字以上推奨）' : null,
        envCheck.ADMIN_PASSWORD === '❌ 未設定' ? 'ADMIN_PASSWORDを設定してください' : null,
        envCheck.GOOGLE_MAPS_API === '❌ 未設定' ? 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEYを設定してください' : null
      ].filter(Boolean)
    })

  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { error: '環境変数チェックに失敗しました', details: error },
      { status: 500 }
    )
  }
}
