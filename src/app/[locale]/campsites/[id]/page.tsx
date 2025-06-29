import CampsiteDetail from '@/components/CampsiteDetail'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface CampsiteDetailPageProps {
  params: {
    locale: string
    id: string
  }
}

async function getCampsite(id: string) {
  try {
    // 直接Supabaseからデータを取得（APIと同じ変換ロジックを使用）
    const { data, error } = await supabase
      .from('campsites')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    // APIと同じ変換ロジックを適用
    return {
      id: data.id,
      name: {
        ja: data.name_ja,
        en: data.name_en
      },
      lat: data.lat,
      lng: data.lng,
      address: {
        ja: data.address_ja,
        en: data.address_en
      },
      phone: data.phone || '',
      website: data.website || '',
      price: data.price,
      nearestStation: {
        ja: data.nearest_station_ja,
        en: data.nearest_station_en
      },
      accessTime: {
        ja: data.access_time_ja,
        en: data.access_time_en
      },
      description: {
        ja: data.description_ja,
        en: data.description_en
      },
      facilities: data.facilities || [],
      activities: data.activities || []
    }
  } catch (error) {
    console.error('Failed to fetch campsite:', error)
    return null
  }
}

export default async function CampsiteDetailPage({ params }: CampsiteDetailPageProps) {
  const campsite = await getCampsite(params.id)

  if (!campsite) {
    notFound()
  }

  return <CampsiteDetail campsite={campsite} />
}

export async function generateMetadata({ params }: CampsiteDetailPageProps) {
  const campsite = await getCampsite(params.id)

  if (!campsite) {
    return {
      title: 'キャンプ場が見つかりません',
    }
  }

  const locale = params.locale === 'en' ? 'en' : 'ja'
  
  return {
    title: `${campsite.name[locale]} - Train Camp App`,
    description: campsite.description[locale],
  }
}
