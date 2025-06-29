import { mapActivityToTranslationKey, mapFacilityToTranslationKey } from '@/utils/facilityMapper'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Supabase admin client (service role key が必要)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CsvRow {
  name_ja: string
  name_en: string
  address_ja: string
  address_en: string
  lat: string
  lng: string
  price: string
  nearest_station_ja: string
  nearest_station_en: string
  access_time_ja: string
  access_time_en: string
  description_ja: string
  description_en: string
  amenities: string
  activities: string
}

function parseCSV(csvText: string): CsvRow[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '')
  if (lines.length === 0) return []
  
  const headers = lines[0]?.split(',').map(h => h.trim()) || []
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    return row as CsvRow
  }).filter(row => row && Object.keys(row).length > 0)
}

function validateRow(row: CsvRow): string | null {
  if (!row.name_ja) return `名前（日本語）が必要です`
  if (!row.address_ja) return `住所（日本語）が必要です`
  if (!row.lat || isNaN(Number(row.lat))) return `緯度が無効です`
  if (!row.lng || isNaN(Number(row.lng))) return `経度が無効です`
  if (!row.price || isNaN(Number(row.price))) return `料金が無効です`
  if (!row.nearest_station_ja) return `最寄り駅が必要です`
  if (!row.access_time_ja) return `アクセス時間が必要です`
  return null
}

function transformRowToDatabase(row: CsvRow) {
  return {
    name_ja: row.name_ja,
    name_en: row.name_en || row.name_ja,
    address_ja: row.address_ja,
    address_en: row.address_en || row.address_ja,
    lat: Number(row.lat),
    lng: Number(row.lng),
    price: `¥${Number(row.price).toLocaleString()}/泊`, // 文字列フォーマット
    nearest_station_ja: row.nearest_station_ja,
    nearest_station_en: row.nearest_station_en || row.nearest_station_ja,
    access_time_ja: row.access_time_ja,
    access_time_en: row.access_time_en || row.access_time_ja,
    description_ja: row.description_ja,
    description_en: row.description_en || row.description_ja,
    phone: '', // デフォルト値
    website: '', // デフォルト値
    facilities: row.amenities ? row.amenities.split('・').map(a => mapFacilityToTranslationKey(a.trim())) : [],
    activities: row.activities ? row.activities.split('・').map(a => mapActivityToTranslationKey(a.trim())) : []
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('csv') as File

    if (!file) {
      return NextResponse.json(
        { error: 'CSVファイルが見つかりません' },
        { status: 400 }
      )
    }

    const csvText = await file.text()
    const rows = parseCSV(csvText)

    let successCount = 0
    const errors: Array<{ row: number; message: string }> = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row) continue
      
      const rowNumber = i + 2 // CSVの行番号（ヘッダーを除く）

      try {
        // バリデーション
        const validationError = validateRow(row)
        if (validationError) {
          errors.push({ row: rowNumber, message: validationError })
          continue
        }

        // データ変換
        const campsiteData = transformRowToDatabase(row)

        // データベースに挿入
        const { error } = await supabaseAdmin
          .from('campsites')
          .insert(campsiteData)

        if (error) {
          errors.push({ row: rowNumber, message: error.message })
        } else {
          successCount++
        }
      } catch (error) {
        errors.push({ 
          row: rowNumber, 
          message: error instanceof Error ? error.message : '不明なエラー' 
        })
      }
    }

    return NextResponse.json({
      success: successCount,
      errors: errors
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { error: 'CSVインポートに失敗しました' },
      { status: 500 }
    )
  }
}
