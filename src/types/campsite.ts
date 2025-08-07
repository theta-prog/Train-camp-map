export interface Campsite {
  id: string
  name: string // nameJaから変換
  lat: number | null
  lng: number | null
  address: string // addressJaから変換
  phone: string
  website: string
  reservationUrl?: string
  price: string
  priceMin?: number
  priceMax?: number
  facilities: string[]
  activities: string[]
  nearestStation: string // nearestStationJaから変換
  accessTime: string // accessTimeJaから変換
  description: string // descriptionJaから変換
  images: string[]
  checkInTime?: string
  checkOutTime?: string
  cancellationPolicy?: string // cancellationPolicyJaから変換
}

export interface SearchFilters {
  keyword: string
  maxPrice: number
  minPrice?: number // 最小料金フィルター
  facilities: string[]
  activities: string[]
}
