import { getAuthFromRequest, requireAdmin } from '@/lib/auth'
import { formatCampsiteForClient, formatCampsiteForDb } from '@/lib/database-helpers'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 個別キャンプサイトAPI
 */

// GET /api/campsites/[id] - 特定のキャンプサイト取得
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campsite = await prisma.campsite.findUnique({
      where: { id: params.id }
    })

    if (!campsite) {
      return NextResponse.json(
        { error: 'キャンプサイトが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: formatCampsiteForClient(campsite)
    })
  } catch (error) {
    console.error('Campsite fetch error:', error)
    return NextResponse.json(
      { error: 'キャンプサイトの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// PUT /api/campsites/[id] - キャンプサイト更新（管理者のみ）
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthFromRequest(request)
  
  if (!requireAdmin(auth)) {
    return NextResponse.json(
      { error: '管理者権限が必要です' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    
    // 既にキャメルケースの場合とスネークケースの場合の両方に対応
    const data = {
      nameJa: body.nameJa || body.name_ja,
      nameEn: body.nameEn || body.name_en,
      lat: body.lat,
      lng: body.lng,
      addressJa: body.addressJa || body.address_ja,
      addressEn: body.addressEn || body.address_en,
      phone: body.phone,
      website: body.website,
      price: body.price,
      nearestStationJa: body.nearestStationJa || body.nearest_station_ja,
      nearestStationEn: body.nearestStationEn || body.nearest_station_en,
      accessTimeJa: body.accessTimeJa || body.access_time_ja,
      accessTimeEn: body.accessTimeEn || body.access_time_en,
      descriptionJa: body.descriptionJa || body.description_ja,
      descriptionEn: body.descriptionEn || body.description_en,
      facilities: body.facilities || [],
      activities: body.activities || [],
      images: body.images || [],
      priceMin: body.priceMin,
      priceMax: body.priceMax,
      reservationUrl: body.reservationUrl,
      reservationPhone: body.reservationPhone,
      reservationEmail: body.reservationEmail,
      checkInTime: body.checkInTime || body.check_in_time,
      checkOutTime: body.checkOutTime || body.check_out_time,
      cancellationPolicyJa: body.cancellationPolicyJa || body.cancellation_policy_ja,
      cancellationPolicyEn: body.cancellationPolicyEn || body.cancellation_policy_en
    }

    const updatedCampsite = await prisma.campsite.update({
      where: { id: params.id },
      data: formatCampsiteForDb(data)
    })

    return NextResponse.json({
      success: true,
      data: formatCampsiteForClient(updatedCampsite)
    })
  } catch (error) {
    console.error('Campsite update error:', error)
    return NextResponse.json(
      { error: 'キャンプサイトの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// DELETE /api/campsites/[id] - キャンプサイト削除（管理者のみ）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthFromRequest(request)
  
  if (!requireAdmin(auth)) {
    return NextResponse.json(
      { error: '管理者権限が必要です' },
      { status: 403 }
    )
  }

  try {
    await prisma.campsite.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'キャンプサイトを削除しました'
    })
  } catch (error) {
    console.error('Campsite delete error:', error)
    return NextResponse.json(
      { error: 'キャンプサイトの削除に失敗しました' },
      { status: 500 }
    )
  }
}
