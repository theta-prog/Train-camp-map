import { NextRequest, NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

/**
 * 環境変数確認用API（開発・デバッグ用）
 * 本番環境でのデバッグに使用
 */
export async function GET(request: NextRequest) {
  try {
    // セキュリティ: 本番環境でのアクセス制限
    const isDev = process.env.NODE_ENV !== 'production'
    const hasDebugFlag = request.nextUrl.searchParams.get('debug') === 'true'
    
    if (!isDev && !hasDebugFlag) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? '✅ 設定済み' : '❌ 未設定',
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ 設定済み' : '❌ 未設定',
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅ 設定済み' : '❌ 未設定',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ 設定済み' : '❌ 未設定',
      ADMIN_ALLOWED_EMAILS: process.env.ADMIN_ALLOWED_EMAILS ? '✅ 設定済み' : '❌ 未設定',
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ 設定済み' : '❌ 未設定',
      timestamp: new Date().toISOString(),
    }

    // データベース接続テスト
    let dbConnection = '❌ 未テスト'
    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()
        await prisma.$connect()
        await prisma.$disconnect()
        dbConnection = '✅ 接続成功'
      } catch (error) {
        dbConnection = `❌ 接続エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }

    return NextResponse.json({
      status: 'Environment Variables Check',
      environment: envStatus,
      database_connection: dbConnection,
      recommendations: {
        DATABASE_URL: !process.env.DATABASE_URL ? 'Neonデータベースを作成してDATABASE_URLを設定してください' : null,
        JWT_SECRET: !process.env.JWT_SECRET ? '32文字以上の強力なJWT_SECRETを設定してください' : null,
        ADMIN_PASSWORD: !process.env.ADMIN_PASSWORD ? '管理者パスワードを設定してください' : null,
      }
    })

  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        error: 'Environment check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
