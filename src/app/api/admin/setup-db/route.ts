import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

/**
 * データベース初期化API
 * 本番環境でのテーブル作成用（一度だけ実行）
 */
export async function POST(request: NextRequest) {
  try {
    // セキュリティ: 管理者のみ実行可能
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_SETUP_KEY || 'setup-key'
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prismaを使ってマイグレーション実行
    // まず、Roleタイプを作成
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'ADMIN',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "campsites" (
        "id" TEXT NOT NULL,
        "name_ja" TEXT NOT NULL,
        "name_en" TEXT,
        "lat" DOUBLE PRECISION,
        "lng" DOUBLE PRECISION,
        "address_ja" TEXT NOT NULL,
        "address_en" TEXT,
        "phone" TEXT,
        "website" TEXT,
        "price" TEXT NOT NULL,
        "nearest_station_ja" TEXT NOT NULL,
        "nearest_station_en" TEXT,
        "access_time_ja" TEXT NOT NULL,
        "access_time_en" TEXT,
        "description_ja" TEXT NOT NULL,
        "description_en" TEXT,
        "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "price_min" INTEGER,
        "price_max" INTEGER,
        "reservation_url" TEXT,
        "reservation_phone" TEXT,
        "reservation_email" TEXT,
        "check_in_time" TEXT,
        "check_out_time" TEXT,
        "cancellation_policy_ja" TEXT,
        "cancellation_policy_en" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "campsites_pkey" PRIMARY KEY ("id")
      );
    `

    // テーブル確認
    const users = await prisma.$queryRaw`SELECT COUNT(*) FROM users`
    const campsites = await prisma.$queryRaw`SELECT COUNT(*) FROM campsites`

    // BigInt を Number に変換してシリアライゼーション可能にする
    const usersCount = Number((users as any)[0].count)
    const campsitesCount = Number((campsites as any)[0].count)

    return NextResponse.json({
      message: 'データベース初期化完了',
      tables: {
        users: usersCount,
        campsites: campsitesCount
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { 
        error: 'データベース初期化に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
