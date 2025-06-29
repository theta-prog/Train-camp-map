import { supabase } from '@/lib/supabase'
import { campsiteSchema } from '@/lib/validations/campsite'
import { NextRequest, NextResponse } from 'next/server'

// データベースのスネークケースからキャメルケースに変換
function transformFromDatabase(dbData: any) {
  return {
    id: dbData.id,
    name: {
      ja: dbData.name_ja,
      en: dbData.name_en
    },
    lat: dbData.lat,
    lng: dbData.lng,
    address: {
      ja: dbData.address_ja,
      en: dbData.address_en
    },
    phone: dbData.phone || '',
    website: dbData.website || '',
    price: dbData.price,
    nearestStation: {
      ja: dbData.nearest_station_ja,
      en: dbData.nearest_station_en
    },
    accessTime: {
      ja: dbData.access_time_ja,
      en: dbData.access_time_en
    },
    description: {
      ja: dbData.description_ja,
      en: dbData.description_en
    },
    facilities: dbData.facilities || [],
    activities: dbData.activities || []
  }
}

// GET /api/campsites - キャンプ場一覧取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('campsites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'キャンプ場の取得に失敗しました' },
        { status: 500 }
      )
    }

    // データを変換
    const transformedData = data?.map(transformFromDatabase) || []

    return NextResponse.json({ data: transformedData })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// POST /api/campsites - キャンプ場新規作成
export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: '無効なJSONデータです' },
        { status: 400 }
      )
    }
    
    // バリデーション
    const validatedData = campsiteSchema.parse(body)
    
    const { data, error } = await supabase
      .from('campsites')
      .insert([
        {
          ...validatedData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'キャンプ場の作成に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      // Zodバリデーションエラー
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
