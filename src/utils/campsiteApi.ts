import { CampsiteFormData } from '@/lib/validations/campsite'
import { Campsite } from '@/types/campsite'

/**
 * API レスポンスをフロントエンド用のCampsite型に変換する
 */
export function transformApiCampsiteToFrontend(apiCampsite: CampsiteFormData & { id: string }): Campsite {
  return {
    id: apiCampsite.id,
    name: {
      ja: apiCampsite.name_ja,
      en: apiCampsite.name_en || apiCampsite.name_ja, // 英語名がない場合は日本語名を使用
    },
    lat: apiCampsite.lat || null,
    lng: apiCampsite.lng || null,
    address: {
      ja: apiCampsite.address_ja,
      en: apiCampsite.address_en || apiCampsite.address_ja,
    },
    phone: apiCampsite.phone || '',
    website: apiCampsite.website || '',
    price: apiCampsite.price,
    facilities: apiCampsite.facilities || [],
    activities: apiCampsite.activities || [],
    nearestStation: {
      ja: apiCampsite.nearest_station_ja,
      en: apiCampsite.nearest_station_en || apiCampsite.nearest_station_ja,
    },
    accessTime: {
      ja: apiCampsite.access_time_ja,
      en: apiCampsite.access_time_en || apiCampsite.access_time_ja,
    },
    description: {
      ja: apiCampsite.description_ja,
      en: apiCampsite.description_en || apiCampsite.description_ja,
    },
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
