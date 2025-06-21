import { supabase } from '@/lib/supabase'
import { campsiteSchema } from '@/lib/validations/campsite'
import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json({ data })
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
    const body = await request.json()
    
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
