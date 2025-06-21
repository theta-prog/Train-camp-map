import { supabase } from '@/lib/supabase'
import { campsiteSchema } from '@/lib/validations/campsite'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  id: string
}

// GET /api/campsites/[id] - 個別キャンプ場取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { data, error } = await supabase
      .from('campsites')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'キャンプ場が見つかりません' },
          { status: 404 }
        )
      }
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

// PUT /api/campsites/[id] - キャンプ場更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json()
    
    // バリデーション
    const validatedData = campsiteSchema.parse(body)
    
    const { data, error } = await supabase
      .from('campsites')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'キャンプ場が見つかりません' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'キャンプ場の更新に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
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

// DELETE /api/campsites/[id] - キャンプ場削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { error } = await supabase
      .from('campsites')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'キャンプ場の削除に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'キャンプ場を削除しました' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
