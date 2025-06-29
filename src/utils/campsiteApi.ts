import { Campsite } from '@/types/campsite'

/**
 * API レスポンスをフロントエンド用のCampsite型に変換する
 * 新しいキャメルケース形式のAPIレスポンスに対応
 */
export function transformApiCampsiteToFrontend(apiCampsite: any): Campsite {
  // APIが既にキャメルケース形式で返すため、直接使用
  return {
    id: apiCampsite.id,
    name: apiCampsite.name,
    lat: apiCampsite.lat,
    lng: apiCampsite.lng,
    address: apiCampsite.address,
    phone: apiCampsite.phone || '',
    website: apiCampsite.website || '',
    price: apiCampsite.price,
    facilities: apiCampsite.facilities || [],
    activities: apiCampsite.activities || [],
    nearestStation: apiCampsite.nearestStation,
    accessTime: apiCampsite.accessTime,
    description: apiCampsite.description,
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
    
    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid API response format')
    }
    
    return result.data.map(transformApiCampsiteToFrontend)
  } catch (error) {
    console.error('Failed to fetch campsites:', error)
    throw error
  }
}

/**
 * 価格文字列から数値を抽出する
 */
export function extractPriceFromString(priceString: string): number {
  const priceMatch = priceString.match(/\d+/)
  return priceMatch ? parseInt(priceMatch[0]) : 0
}
