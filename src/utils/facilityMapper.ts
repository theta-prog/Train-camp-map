/**
 * データベースの値を翻訳キーにマッピングする関数
 * DB値と翻訳ファイルのキーの不一致を解決します
 */

// DB値から翻訳キーへのマッピング
const FACILITY_MAPPING: Record<string, string> = {
  // 英語の設備名
  restroom: 'restroom',
  store: 'store',
  toilet: 'toilet',
  shower: 'shower',
  parking: 'parking',
  wifi: 'wifi',
  kitchen: 'kitchen',
  bbq: 'bbq',
  rental: 'rental',
  shop: 'shop',
  laundry: 'laundry',
  
  // 日本語の設備名（実際に使用される分）
  'トイレ': 'toilet',
  'シャワー': 'shower',
  '炊事場': 'kitchen',
  '駐車場': 'parking',
  'コインランドリー': 'laundry',
  'レストラン': 'restaurant',
}

const ACTIVITY_MAPPING: Record<string, string> = {
  // 英語のアクティビティ名
  photography: 'photography',
  boating: 'boating',
  hiking: 'hiking',
  bbq: 'bbq',
  fishing: 'fishing',
  canoe: 'canoe',
  boat: 'boat',
  river: 'river',
  stargazing: 'stargazing',
  swimming: 'swimming',
  cycling: 'cycling',
  birdwatching: 'birdwatching',
  
    // 日本語のアクティビティ名（実際に使用される分）
  'ハイキング': 'hiking',
  '星空観察': 'stargazing',
  'バーベキュー': 'bbq',
  '釣り': 'fishing',
  'カヌー': 'canoe',
  '温泉': 'hotspring',
  '森林浴': 'forestbath',
  '野鳥観察': 'birdwatching',
}

/**
 * 設備のDB値を翻訳キーにマッピングする
 */
export function mapFacilityToTranslationKey(facility: string): string {
  return FACILITY_MAPPING[facility] || facility
}

/**
 * アクティビティのDB値を翻訳キーにマッピングする
 */
export function mapActivityToTranslationKey(activity: string): string {
  return ACTIVITY_MAPPING[activity] || activity
}

/**
 * 設備配列を翻訳キー配列にマッピングする
 */
export function mapFacilitiesToTranslationKeys(facilities: string[]): string[] {
  return facilities.map(mapFacilityToTranslationKey)
}

/**
 * アクティビティ配列を翻訳キー配列にマッピングする
 */
export function mapActivitiesToTranslationKeys(activities: string[]): string[] {
  return activities.map(mapActivityToTranslationKey)
}
