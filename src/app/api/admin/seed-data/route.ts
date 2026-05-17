import { readFile } from 'node:fs/promises'
import path from 'node:path'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type CsvRecord = Record<string, string>

function splitCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index++) {
    const char = line[index]

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"'
        index++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function parseCsv(content: string): CsvRecord[] {
  const normalized = content.replace(/^\uFEFF/, '').trim()
  const lines = normalized.split(/\r?\n/).filter((line) => line.trim().length > 0)

  if (lines.length < 2) {
    return []
  }

  const headerLine = lines[0]

  if (!headerLine) {
    return []
  }

  const headers = splitCsvLine(headerLine)

  return lines.slice(1).map((line, rowIndex) => {
    const values = splitCsvLine(line)

    if (values.length !== headers.length) {
      throw new Error(
        `CSV row ${rowIndex + 2} has ${values.length} columns. Expected ${headers.length}.`
      )
    }

    return headers.reduce<CsvRecord>((record, header, columnIndex) => {
      record[header] = values[columnIndex] ?? ''
      return record
    }, {})
  })
}

function splitList(value: string): string[] {
  if (!value) {
    return []
  }

  return value
    .split(/[・/]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getRequiredField(row: CsvRecord, fieldName: string): string {
  const value = row[fieldName]

  if (value === undefined) {
    throw new Error(`Missing required field: ${fieldName}`)
  }

  return value
}

function getOptionalField(row: CsvRecord, fieldName: string): string | undefined {
  const value = row[fieldName]

  if (value === undefined) {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function parseRequiredNumber(value: string, fieldName: string, campsiteName: string): number {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName} for ${campsiteName}: ${value}`)
  }

  return parsed
}

function normalizePrice(value: string) {
  const trimmed = value.trim()
  const numericParts = Array.from(trimmed.matchAll(/\d[\d,]*/g))
    .map((match) => Number(match[0].replace(/,/g, '')))
    .filter((number) => Number.isFinite(number))

  if (!trimmed) {
    return {
      label: '',
      min: undefined,
      max: undefined,
    }
  }

  if (/[¥円]/.test(trimmed)) {
    return {
      label: trimmed,
      min: numericParts[0],
      max: numericParts.at(-1) ?? numericParts[0],
    }
  }

  if (numericParts.length === 0) {
    return {
      label: trimmed,
      min: undefined,
      max: undefined,
    }
  }

  if (numericParts.length === 1) {
    const amount = numericParts[0]

    if (amount === undefined) {
      throw new Error(`Unable to normalize price: ${trimmed}`)
    }

    return {
      label: `¥${amount.toLocaleString()}/泊`,
      min: amount,
      max: amount,
    }
  }

  const min = numericParts[0]
  const max = numericParts.at(-1) ?? min

  if (min === undefined || max === undefined) {
    throw new Error(`Unable to normalize price range: ${trimmed}`)
  }

  return {
    label: `¥${min.toLocaleString()}-¥${max.toLocaleString()}/泊`,
    min,
    max,
  }
}

async function loadSeedCampsites(): Promise<Prisma.CampsiteCreateInput[]> {
  const csvPath = path.join(process.cwd(), 'data', 'public_transport_campsites.csv')
  const csvContent = await readFile(csvPath, 'utf8')
  const rows = parseCsv(csvContent)

  return rows.map((row) => {
    const nameJa = getRequiredField(row, 'name_ja')
    const nameEn = getOptionalField(row, 'name_en')
    const addressJa = getRequiredField(row, 'address_ja')
    const addressEn = getOptionalField(row, 'address_en')
    const nearestStationJa = getRequiredField(row, 'nearest_station_ja')
    const nearestStationEn = getOptionalField(row, 'nearest_station_en')
    const accessTimeJa = getRequiredField(row, 'access_time_ja')
    const accessTimeEn = getOptionalField(row, 'access_time_en')
    const descriptionJa = getRequiredField(row, 'description_ja')
    const descriptionEn = getOptionalField(row, 'description_en')
    const website = getOptionalField(row, 'homepage_url')
    const price = normalizePrice(getRequiredField(row, 'price'))

    return {
      nameJa,
      addressJa,
      lat: parseRequiredNumber(getRequiredField(row, 'lat'), 'lat', nameJa),
      lng: parseRequiredNumber(getRequiredField(row, 'lng'), 'lng', nameJa),
      price: price.label,
      facilities: splitList(getRequiredField(row, 'amenities')),
      activities: splitList(getRequiredField(row, 'activities')),
      nearestStationJa,
      accessTimeJa,
      descriptionJa,
      images: [],
      ...(nameEn ? { nameEn } : {}),
      ...(addressEn ? { addressEn } : {}),
      ...(website ? { website, reservationUrl: website } : {}),
      ...(price.min !== undefined ? { priceMin: price.min } : {}),
      ...(price.max !== undefined ? { priceMax: price.max } : {}),
      ...(nearestStationEn ? { nearestStationEn } : {}),
      ...(accessTimeEn ? { accessTimeEn } : {}),
      ...(descriptionEn ? { descriptionEn } : {}),
    }
  })
}

/**
 * CSVベースのキャンプ場データ挿入API
 * 管理画面から実データをまとめて登録するために使用する
 */
export async function POST(request: NextRequest) {
  try {
    // セキュリティ: 管理者のみ実行可能
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_SETUP_KEY || 'setup-key'
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sampleCampsites = await loadSeedCampsites()

    // データベースに挿入（upsert使用で重複を避ける）
    let insertedCount = 0
    let updatedCount = 0

    for (const campsite of sampleCampsites) {
      // 名前+住所または座標が一致する既存レコードを更新する
      const existing = await prisma.campsite.findFirst({
        where: {
          OR: [
            {
              AND: [
                { nameJa: campsite.nameJa },
                { addressJa: campsite.addressJa },
              ],
            },
            {
              AND: [
                { lat: campsite.lat },
                { lng: campsite.lng },
              ],
            },
          ],
        },
      })

      if (existing) {
        // 更新
        await prisma.campsite.update({
          where: { id: existing.id },
          data: {
            ...campsite,
            updatedAt: new Date()
          }
        })
        updatedCount++
      } else {
        // 新規挿入
        await prisma.campsite.create({
          data: {
            ...campsite,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        insertedCount++
      }
    }

    // 結果確認
    const totalCampsites = await prisma.campsite.count()

    return NextResponse.json({
      message: 'サンプルデータの挿入が完了しました',
      result: {
        inserted: insertedCount,
        updated: updatedCount,
        total: totalCampsites
      },
      source: 'data/public_transport_campsites.csv',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Seed data error:', error)
    return NextResponse.json(
      { 
        error: 'サンプルデータの挿入に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
