import { Campsite } from '@/types/campsite'

/**
 * API レスポンスをフロントエンド用のCampsite型に変換する
 * 新しいPrismaスキーマ形式のAPIレスポンスに対応
 */
export function transformApiCampsiteToFrontend(apiCampsite: any): Campsite {
  return {
    id: apiCampsite.id,
    name: apiCampsite.nameJa, // nameJa -> name
    lat: apiCampsite.lat,
    lng: apiCampsite.lng,
    address: apiCampsite.addressJa, // addressJa -> address
    phone: apiCampsite.phone || '',
    website: apiCampsite.website || '',
    reservationUrl: apiCampsite.reservationUrl,
    price: apiCampsite.price,
    priceMin: apiCampsite.priceMin,
    priceMax: apiCampsite.priceMax,
    facilities: apiCampsite.facilities || [],
    activities: apiCampsite.activities || [],
    nearestStation: apiCampsite.nearestStationJa, // nearestStationJa -> nearestStation
    accessTime: apiCampsite.accessTimeJa, // accessTimeJa -> accessTime
    description: apiCampsite.descriptionJa, // descriptionJa -> description
    images: apiCampsite.images || [],
    checkInTime: apiCampsite.checkInTime,
    checkOutTime: apiCampsite.checkOutTime,
    cancellationPolicy: apiCampsite.cancellationPolicyJa // cancellationPolicyJa -> cancellationPolicy
  }
}

/**
 * API からキャンプサイト一覧を取得する
 */
export async function fetchCampsites(): Promise<Campsite[]> {
  try {
    const response = await fetch('/api/campsites')
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (!result.campsites || !Array.isArray(result.campsites)) {
      throw new Error('Invalid API response format')
    }
    
    return result.campsites.map(transformApiCampsiteToFrontend)
  } catch (error) {
    console.error('Failed to fetch campsites:', error)
    throw error
  }
}

/**
 * 価格文字列から数値を抽出する
 */
export function extractPriceFromString(priceString: string): number {
  // カンマを除去してから数値を抽出
  const cleanedPrice = priceString.replace(/,/g, '')
  const priceMatch = cleanedPrice.match(/\d+/)
  return priceMatch ? parseInt(priceMatch[0]) : 0
}
