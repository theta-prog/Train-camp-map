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
  price: string
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
  facilities: string[]
  activities: string[]
}
