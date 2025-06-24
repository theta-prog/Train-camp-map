import { z } from 'zod'

// キャンプ場登録フォームのバリデーションスキーマ
export const campsiteSchema = z.object({
  // 基本情報
  name_ja: z.string().min(1, '日本語名は必須です').max(100, '100文字以内で入力してください'),
  name_en: z.string().max(100, '100文字以内で入力してください').optional(),
  
  // 位置情報 (Google Mapで選択可能、手動入力も可能)
  lat: z.number({ invalid_type_error: '緯度は数値で入力してください' })
    .min(-90, '緯度は-90以上である必要があります')
    .max(90, '緯度は90以下である必要があります')
    .optional(),
  lng: z.number({ invalid_type_error: '経度は数値で入力してください' })
    .min(-180, '経度は-180以上である必要があります')
    .max(180, '経度は180以下である必要があります')
    .optional(),
  
  // 住所情報
  address_ja: z.string().min(1, '日本語住所は必須です').max(200, '200文字以内で入力してください'),
  address_en: z.string().max(200, '200文字以内で入力してください').optional(),
  
  // 連絡先
  phone: z.string().regex(/^[\d\-\+\(\)\s]*$/, '有効な電話番号を入力してください').optional().or(z.literal('')),
  website: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  reservationUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  
  // 料金
  price: z.string().min(1, '料金は必須です').max(100, '100文字以内で入力してください'),
  priceMin: z.number().min(0, '最小料金は0以上である必要があります').optional(),
  priceMax: z.number().min(0, '最大料金は0以上である必要があります').optional(),
  
  // チェックイン・チェックアウト
  checkInTime: z.string().max(50, '50文字以内で入力してください').optional().or(z.literal('')),
  checkOutTime: z.string().max(50, '50文字以内で入力してください').optional().or(z.literal('')),
  cancellationPolicy: z.string().max(500, '500文字以内で入力してください').optional().or(z.literal('')),
  
  // アクセス情報
  nearest_station_ja: z.string().min(1, '最寄り駅（日本語）は必須です').max(100, '100文字以内で入力してください'),
  nearest_station_en: z.string().max(100, '100文字以内で入力してください').optional(),
  access_time_ja: z.string().min(1, 'アクセス時間（日本語）は必須です').max(100, '100文字以内で入力してください'),
  access_time_en: z.string().max(100, '100文字以内で入力してください').optional(),
  
  // 説明
  description_ja: z.string().min(1, '説明（日本語）は必須です').max(1000, '1000文字以内で入力してください'),
  description_en: z.string().max(1000, '1000文字以内で入力してください').optional(),
  
  // 設備・アクティビティ
  facilities: z.array(z.string()),
  activities: z.array(z.string()),
  
  // 画像
  images: z.array(z.string().url('有効なURLを入力してください')).optional(),
})

export type CampsiteFormData = z.infer<typeof campsiteSchema>

// 利用可能な設備一覧
export const AVAILABLE_FACILITIES = [
  { id: 'restroom', label_ja: 'トイレ', label_en: 'Restroom' },
  { id: 'shower', label_ja: 'シャワー', label_en: 'Shower' },
  { id: 'parking', label_ja: '駐車場', label_en: 'Parking' },
  { id: 'wifi', label_ja: 'WiFi', label_en: 'WiFi' },
  { id: 'bbq', label_ja: 'BBQ場', label_en: 'BBQ Area' },
  { id: 'kitchen', label_ja: 'キッチン', label_en: 'Kitchen' },
  { id: 'laundry', label_ja: 'ランドリー', label_en: 'Laundry' },
  { id: 'store', label_ja: '売店', label_en: 'Store' },
] as const

// 利用可能なアクティビティ一覧
export const AVAILABLE_ACTIVITIES = [
  { id: 'hiking', label_ja: 'ハイキング', label_en: 'Hiking' },
  { id: 'fishing', label_ja: '釣り', label_en: 'Fishing' },
  { id: 'swimming', label_ja: '水泳', label_en: 'Swimming' },
  { id: 'cycling', label_ja: 'サイクリング', label_en: 'Cycling' },
  { id: 'boating', label_ja: 'ボート', label_en: 'Boating' },
  { id: 'stargazing', label_ja: '星空観察', label_en: 'Stargazing' },
  { id: 'photography', label_ja: '写真撮影', label_en: 'Photography' },
  { id: 'birdwatching', label_ja: 'バードウォッチング', label_en: 'Bird Watching' },
] as const
