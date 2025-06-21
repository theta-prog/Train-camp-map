/**
 * データベースの値を翻訳キーにマッピングする関数
 * DB値と翻訳ファイルのキーの不一致を解決します
 */

// DB値から翻訳キーへのマッピング
const FACILITY_MAPPING: Record<string, string> = {
  // 修正が必要なマッピング
  restroom: 'restroom', // そのまま使用
  store: 'store', // そのまま使用
  // 既に一致している項目
  toilet: 'toilet',
  shower: 'shower',
  parking: 'parking',
  wifi: 'wifi',
  kitchen: 'kitchen',
  bbq: 'bbq',
  rental: 'rental',
  shop: 'shop',
  laundry: 'laundry',
}

const ACTIVITY_MAPPING: Record<string, string> = {
  // 修正が必要なマッピング
  photography: 'photography', // そのまま使用
  boating: 'boating', // そのまま使用
  // 既に一致している項目
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
