import { Campsite, SearchFilters } from '@/types/campsite'

// キャンプ場データをフィルタリングする関数
export function filterCampsites(campsites: Campsite[], filters: SearchFilters): Campsite[] {
  return campsites.filter(campsite => {
    // キーワード検索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      const searchText = `${campsite.name} ${campsite.address}`.toLowerCase()
      if (!searchText.includes(keyword)) {
        return false
      }
    }

    // 設備フィルター
    if (filters.facilities.length > 0) {
      if (!filters.facilities.every(facility => campsite.facilities.includes(facility))) {
        return false
      }
    }

    // アクティビティフィルター
    if (filters.activities.length > 0) {
      if (!filters.activities.every(activity => campsite.activities.includes(activity))) {
        return false
      }
    }

    return true
  })
}

// 価格文字列から数値を抽出する関数
export function extractPrice(priceString: string): number {
  // null, undefined, 空文字の場合は0を返す
  if (!priceString || typeof priceString !== 'string') {
    return 0
  }
  
  // コンマを除去してから数値を抽出
  const cleanedString = priceString.replace(/,/g, '')
  const match = cleanedString.match(/(\d+)/)
  return match && match[1] ? parseInt(match[1], 10) : 0
}
