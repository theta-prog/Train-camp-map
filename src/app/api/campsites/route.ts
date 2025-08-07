import { getAuthFromRequest, requireAdmin } from '@/lib/auth'
import { formatCampsiteForClient, formatCampsiteForDb } from '@/lib/database-helpers'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const campsiteSchema = z.object({
  nameJa: z.string().min(1),
  nameEn: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  addressJa: z.string().min(1),
  addressEn: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  price: z.string(),
  nearestStationJa: z.string(),
  nearestStationEn: z.string().optional(),
  accessTimeJa: z.string(),
  accessTimeEn: z.string().optional(),
  descriptionJa: z.string(),
  descriptionEn: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  reservationUrl: z.string().optional(),
  reservationPhone: z.string().optional(),
  reservationEmail: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  cancellationPolicyJa: z.string().optional(),
  cancellationPolicyEn: z.string().optional()
})

/**
 * セキュアなキャンプサイトAPI
 * フロントエンドからDBへの直接アクセスは完全に遮断
 * すべてのDB操作はサーバーサイドで制御
 */

// GET /api/secure/campsites - キャンプサイト一覧取得（認証不要）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q')
    
    // URLデコードと文字列の正規化
    const query = rawQuery ? decodeURIComponent(rawQuery).trim() : null

    let campsites
    if (query) {
      campsites = await prisma.campsite.findMany({
        where: {
          OR: [
            { nameJa: { contains: query } },
            { nameEn: { contains: query } },
            { addressJa: { contains: query } },
            { descriptionJa: { contains: query } }
          ]
        }
      })
    } else {
      campsites = await prisma.campsite.findMany()
    }

    // SQLiteのJSON文字列を配列に変換
    const formattedCampsites = campsites.map(formatCampsiteForClient)

    return NextResponse.json({ campsites: formattedCampsites })

  } catch (error) {
    console.error('Campsites fetch error:', error)
    return NextResponse.json(
      { error: 'キャンプサイトの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST /api/secure/campsites - キャンプサイト作成（管理者権限必要）
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request)
    
    if (!requireAdmin(auth)) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = campsiteSchema.parse(body)

    // 配列をJSON文字列に変換
    const formattedData = formatCampsiteForDb(data)

    const campsite = await prisma.campsite.create({
      data: formattedData
    })

    // レスポンス時は配列に戻す
    const formattedCampsite = formatCampsiteForClient(campsite)

    return NextResponse.json({
      message: 'キャンプサイトが作成されました',
      campsite: formattedCampsite
    })

  } catch (error) {
    console.error('Campsite creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'キャンプサイトの作成に失敗しました' },
      { status: 500 }
    )
  }
}
