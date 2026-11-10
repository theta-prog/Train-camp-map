import { NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

/**
 * 環境変数確認用API（開発・デバッグ用）
 * ローカル開発環境でのみ使用
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? '✅ 設定済み' : '❌ 未設定',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ 設定済み' : '❌ 未設定',
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
      } catch {
        dbConnection = '❌ 接続エラー'
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

  } catch {
    return NextResponse.json(
      { 
        error: 'Environment check failed'
      },
      { status: 500 }
    )
  }
}
