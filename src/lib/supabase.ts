import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database型定義（後で追加）
export type Database = {
  public: {
    Tables: {
      campsites: {
        Row: {
          id: string
          name_ja: string
          name_en: string | null
          lat: number
          lng: number
          address_ja: string
          address_en: string | null
          phone: string | null
          website: string | null
          price: string
          nearest_station_ja: string
          nearest_station_en: string | null
          access_time_ja: string
          access_time_en: string | null
          description_ja: string
          description_en: string | null
          facilities: string[]
          activities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ja: string
          name_en?: string | null
          lat: number
          lng: number
          address_ja: string
          address_en?: string | null
          phone?: string | null
          website?: string | null
          price: string
          nearest_station_ja: string
          nearest_station_en?: string | null
          access_time_ja: string
          access_time_en?: string | null
          description_ja: string
          description_en?: string | null
          facilities?: string[]
          activities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ja?: string
          name_en?: string | null
          lat?: number
          lng?: number
          address_ja?: string
          address_en?: string | null
          phone?: string | null
          website?: string | null
          price?: string
          nearest_station_ja?: string
          nearest_station_en?: string | null
          access_time_ja?: string
          access_time_en?: string | null
          description_ja?: string
          description_en?: string | null
          facilities?: string[]
          activities?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
