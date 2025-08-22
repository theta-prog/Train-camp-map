import { Campsite } from '@/types/campsite'

/**
 * API レスポンスをフロントエンド用のCampsite型に変換する
 * 新しいformatCampsiteForClient関数で変換済みのAPIレスポンスに対応
 */
export function transformApiCampsiteToFrontend(apiCampsite: any): Campsite {
  // 新しいAPIレスポンスでは既にクライアント用にフォーマット済み
  // nameJa -> name, addressJa -> address など
  if (apiCampsite.name && apiCampsite.address) {
    // 既に変換済みの場合はそのまま返す
    return {
      id: apiCampsite.id,
      name: apiCampsite.name,
      lat: apiCampsite.lat,
      lng: apiCampsite.lng,
      address: apiCampsite.address,
      phone: apiCampsite.phone || '',
      website: apiCampsite.website || '',
      reservationUrl: apiCampsite.reservationUrl,
      price: apiCampsite.price,
      priceMin: apiCampsite.priceMin,
      priceMax: apiCampsite.priceMax,
      facilities: apiCampsite.facilities || [],
      activities: apiCampsite.activities || [],
      nearestStation: apiCampsite.nearestStation,
      accessTime: apiCampsite.accessTime,
      description: apiCampsite.description,
      images: apiCampsite.images || [],
      checkInTime: apiCampsite.checkInTime,
      checkOutTime: apiCampsite.checkOutTime,
      cancellationPolicy: apiCampsite.cancellationPolicy
    }
  }
  
  // 古いAPIレスポンス形式（nameJa, addressJaなど）の場合は変換
  return {
    id: apiCampsite.id,
    name: apiCampsite.nameJa || apiCampsite.name, // nameJa -> name
    lat: apiCampsite.lat,
    lng: apiCampsite.lng,
    address: apiCampsite.addressJa || apiCampsite.address, // addressJa -> address
    phone: apiCampsite.phone || '',
    website: apiCampsite.website || '',
    reservationUrl: apiCampsite.reservationUrl,
    price: apiCampsite.price,
    priceMin: apiCampsite.priceMin,
    priceMax: apiCampsite.priceMax,
    facilities: apiCampsite.facilities || [],
    activities: apiCampsite.activities || [],
    nearestStation: apiCampsite.nearestStationJa || apiCampsite.nearestStation, // nearestStationJa -> nearestStation
    accessTime: apiCampsite.accessTimeJa || apiCampsite.accessTime, // accessTimeJa -> accessTime
    description: apiCampsite.descriptionJa || apiCampsite.description, // descriptionJa -> description
    images: apiCampsite.images || [],
    checkInTime: apiCampsite.checkInTime,
    checkOutTime: apiCampsite.checkOutTime,
    cancellationPolicy: apiCampsite.cancellationPolicyJa || apiCampsite.cancellationPolicy // cancellationPolicyJa -> cancellationPolicy
  }
}

/**
 * API からキャンプサイト一覧を取得する
 * 新しいformatCampsiteForClient関数で既にフォーマット済みのデータを受信
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
    
    // APIが既にクライアント用にフォーマット済みなので、そのまま返す
    return result.campsites as Campsite[]
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
