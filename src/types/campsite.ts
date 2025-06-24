export interface Campsite {
  id: string
  name: {
    ja: string
    en: string
  }
  lat: number
  lng: number
  address: {
    ja: string
    en: string
  }
  phone: string
  website: string
  reservationUrl?: string // 予約サイトURL
  price: string // 表示用の価格文字列（例: "¥2,000-¥5,000/泊" or "¥3,000/泊"）
  priceMin?: number // 最小料金（数値）
  priceMax?: number // 最大料金（数値）
  checkInTime?: string // チェックイン時間
  checkOutTime?: string // チェックアウト時間
  cancellationPolicy?: string // キャンセルポリシー
  images?: string[] // 画像URL配列
  facilities: string[]
  activities: string[]
  nearestStation: {
    ja: string
    en: string
  }
  accessTime: {
    ja: string
    en: string
  }
  description: {
    ja: string
    en: string
  }
}

export interface SearchFilters {
  keyword: string
  maxPrice: number
  minPrice?: number // 最小料金フィルター
  facilities: string[]
  activities: string[]
}
