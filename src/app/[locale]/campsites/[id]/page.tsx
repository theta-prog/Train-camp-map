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
  const { data, error } = await supabase
    .from('campsites')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  // データベースの形式から UI の形式に変換
  return {
    id: data.id,
    name: {
      ja: data.name_ja,
      en: data.name_en || data.name_ja
    },
    lat: data.lat,
    lng: data.lng,
    address: {
      ja: data.address_ja,
      en: data.address_en || data.address_ja
    },
    phone: data.phone || '',
    website: data.website || '',
    reservationUrl: data.reservation_url || undefined,
    price: data.price,
    priceMin: data.price_min || undefined,
    priceMax: data.price_max || undefined,
    checkInTime: data.check_in_time || undefined,
    checkOutTime: data.check_out_time || undefined,
    cancellationPolicy: data.cancellation_policy || undefined,
    images: data.images || [],
    facilities: data.facilities || [],
    activities: data.activities || [],
    nearestStation: {
      ja: data.nearest_station_ja,
      en: data.nearest_station_en || data.nearest_station_ja
    },
    accessTime: {
      ja: data.access_time_ja,
      en: data.access_time_en || data.access_time_ja
    },
    description: {
      ja: data.description_ja,
      en: data.description_en || data.description_ja
    }
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
