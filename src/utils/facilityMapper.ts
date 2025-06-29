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
  
  // 日本語の設備名（CSVから）
  'オートサイト': 'campsite',
  'グランピング': 'glamping',
  'フリーサイト': 'freesite',
  'ハンモックサイト': 'hammocksite',
  '河原サイト': 'riverside',
  '林間サイト': 'forest',
  '芝生サイト': 'grass',
  'デイキャンプサイト': 'daycamp',
  'バーベキューサイト': 'bbq',
  'キャンプサイト': 'campsite',
  '区画サイト': 'pitchsite',
  'ロッジ': 'lodge',
  'バンガロー': 'bungalow',
  'ログキャビン': 'logcabin',
  'コテージ': 'cottage',
  'ゲストハウス': 'guesthouse',
  'Wi-Fi': 'wifi',
  'シャワー': 'shower',
  '炊事場': 'kitchen',
  'バーベキューハウス': 'bbq',
  'バーベキューコンロ': 'bbq',
  '水洗トイレ': 'toilet',
  'レンタル品': 'rental',
  '売店': 'shop',
  '博物館': 'museum',
  'アスレチック': 'athletic',
  '牧場': 'farm',
  'プール': 'pool',
  'プール(夏季)': 'pool',
  '温泉近隣': 'hotspring',
  'キッズエリア': 'kids'
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
  
  // 日本語のアクティビティ名（CSVから）
  'バーベキュー': 'bbq',
  'デイキャンプ': 'daycamp',
  'カヌー': 'canoe',
  'ラフティング': 'rafting',
  '川遊び': 'river',
  '釣り': 'fishing',
  'ハイキング': 'hiking',
  '星空観察': 'stargazing',
  '海水浴': 'swimming',
  'サーフィン': 'surfing',
  'ビーチバレー': 'beachvolley',
  'ハンモック泊': 'hammock',
  '森林浴': 'forestbath',
  '博物館見学': 'museum',
  '渓谷散策': 'valley',
  '温泉': 'hotspring',
  'バードウォッチング': 'birdwatching',
  'プール': 'pool',
  '流しそうめん': 'nagashisomen',
  '潮干狩り': 'shellfishing',
  'アスレチック': 'athletic',
  '動物ふれあい': 'animals',
  '電車見学': 'train',
  '写真撮影': 'photography'
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
