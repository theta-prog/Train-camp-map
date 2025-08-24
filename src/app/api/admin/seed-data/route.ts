import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// このルートは動的にレンダリングされる必要がある
export const dynamic = 'force-dynamic'

/**
 * サンプルデータ挿入API
 * 本番環境でのサンプルキャンプサイトデータ挿入用
 */
export async function POST(request: NextRequest) {
  try {
    // セキュリティ: 管理者のみ実行可能
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_SETUP_KEY || 'setup-key'
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // サンプルキャンプサイトデータ
    const sampleCampsites = [
      {
        id: '1',
        nameJa: '高尾の森わくわくビレッジ',
        nameEn: 'Takao Forest Wakuwaku Village',
        addressJa: '東京都八王子市川町55',
        addressEn: '55 Kawamachi, Hachioji, Tokyo',
        lat: 35.6328,
        lng: 139.2644,
        phone: '042-691-1166',
        website: 'https://www.wakuwaku-village.com/',
        price: '¥2,000-¥4,000/泊',
        facilities: ['toilet', 'shower', 'kitchen', 'bbq', 'parking', 'wifi'],
        activities: ['hiking', 'bbq', 'stargazing', 'photography'],
        nearestStationJa: 'JR高尾駅',
        nearestStationEn: 'JR Takao Station',
        accessTimeJa: 'バス15分',
        accessTimeEn: '15 min by bus',
        descriptionJa: '高尾山の麓にある自然豊かなキャンプ場。BBQやハイキングを楽しめ、星空観察にも最適です。',
        descriptionEn: 'A nature-rich campsite at the foot of Mt. Takao. Perfect for BBQ, hiking, and stargazing.',
        priceMin: 2000,
        priceMax: 4000,
        reservationUrl: 'https://www.wakuwaku-village.com/reservation',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicyJa: 'キャンセル料：利用日の7日前から30%、3日前から50%、当日100%',
        cancellationPolicyEn: 'Cancellation fee: 30% from 7 days before, 50% from 3 days before, 100% on the day',
        images: [
          'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
          'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
          'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800'
        ]
      },
      {
        id: '2',
        nameJa: '奥多摩湖畔キャンプ場',
        nameEn: 'Lake Okutama Campsite',
        addressJa: '東京都西多摩郡奥多摩町原5',
        addressEn: '5 Hara, Okutama, Nishitama, Tokyo',
        lat: 35.7891,
        lng: 139.0234,
        phone: '0428-86-2556',
        website: 'https://okutama-camp.com/',
        price: '¥1,500-¥3,500/泊',
        facilities: ['toilet', 'kitchen', 'bbq', 'parking', 'rental'],
        activities: ['fishing', 'canoe', 'hiking', 'river', 'photography'],
        nearestStationJa: 'JR奥多摩駅',
        nearestStationEn: 'JR Okutama Station',
        accessTimeJa: 'バス20分',
        accessTimeEn: '20 min by bus',
        descriptionJa: '奥多摩湖の美しい景色を楽しめるキャンプ場。釣りやカヌーなどの水上アクティビティが充実しています。',
        descriptionEn: 'Enjoy the beautiful scenery of Lake Okutama. Rich in water activities such as fishing and canoeing.',
        priceMin: 1500,
        priceMax: 3500,
        reservationUrl: 'https://okutama-camp.com/booking',
        checkInTime: '13:00',
        checkOutTime: '10:00',
        cancellationPolicyJa: 'キャンセル料：利用日の3日前から50%、当日100%',
        cancellationPolicyEn: 'Cancellation fee: 50% from 3 days before, 100% on the day',
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800'
        ]
      },
      {
        id: '3',
        nameJa: '相模湖プレジャーフォレスト',
        nameEn: 'Sagamiko Pleasure Forest',
        addressJa: '神奈川県相模原市緑区若柳1634',
        addressEn: '1634 Wakayanagi, Midori-ku, Sagamihara, Kanagawa',
        lat: 35.6045,
        lng: 139.2511,
        phone: '042-685-1111',
        website: 'https://www.sagamiko-resort.jp/',
        price: '¥3,000-¥6,000/泊',
        facilities: ['toilet', 'shower', 'kitchen', 'bbq', 'parking', 'wifi', 'shop'],
        activities: ['bbq', 'fishing', 'boating', 'cycling', 'hiking'],
        nearestStationJa: 'JR相模湖駅',
        nearestStationEn: 'JR Sagamiko Station',
        accessTimeJa: 'バス8分',
        accessTimeEn: '8 min by bus',
        descriptionJa: '相模湖畔の大型リゾート施設内にあるキャンプ場。遊園地も併設しており、家族連れに人気です。',
        descriptionEn: 'A campsite within a large resort facility by Lake Sagami. Popular with families as it also has an amusement park.',
        priceMin: 3000,
        priceMax: 6000,
        reservationUrl: 'https://www.sagamiko-resort.jp/camp/reservation',
        checkInTime: '15:00',
        checkOutTime: '10:00',
        cancellationPolicyJa: 'キャンセル料：利用日の7日前から20%、3日前から50%、当日100%',
        cancellationPolicyEn: 'Cancellation fee: 20% from 7 days before, 50% from 3 days before, 100% on the day',
        images: [
          'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800'
        ]
      },
      {
        id: '4',
        nameJa: '富士五湖キャンプ場',
        nameEn: 'Fuji Five Lakes Campsite',
        addressJa: '山梨県南都留郡富士河口湖町船津1',
        addressEn: '1 Funatsu, Fujikawaguchiko, Minamitsuru, Yamanashi',
        lat: 35.5089,
        lng: 138.7628,
        phone: '0555-72-1331',
        website: 'https://fujigoko-camp.com/',
        price: '¥2,500-¥5,000/泊',
        facilities: ['toilet', 'shower', 'kitchen', 'bbq', 'parking', 'wifi', 'hot_spring'],
        activities: ['hiking', 'fishing', 'photography', 'cycling', 'stargazing', 'hot_spring'],
        nearestStationJa: 'JR河口湖駅',
        nearestStationEn: 'JR Kawaguchiko Station',
        accessTimeJa: 'バス10分',
        accessTimeEn: '10 min by bus',
        descriptionJa: '富士山の絶景を望める湖畔のキャンプ場。温泉施設もあり、リラックスできる環境です。',
        descriptionEn: 'Lakeside campsite with spectacular views of Mt. Fuji. Hot spring facilities are also available for relaxation.',
        priceMin: 2500,
        priceMax: 5000,
        reservationUrl: 'https://fujigoko-camp.com/reserve',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicyJa: 'キャンセル料：利用日の5日前から30%、当日100%',
        cancellationPolicyEn: 'Cancellation fee: 30% from 5 days before, 100% on the day',
        images: [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800'
        ]
      },
      {
        id: '5',
        nameJa: 'あしがら森林公園キャンプ場',
        nameEn: 'Ashigara Forest Park Campsite',
        addressJa: '神奈川県足柄上郡山北町皆瀬川635',
        addressEn: '635 Minasegawa, Yamakita, Ashigarakami, Kanagawa',
        lat: 35.3667,
        lng: 139.0833,
        phone: '0465-78-3181',
        website: 'https://ashigara-forest.com/',
        price: '¥1,800-¥3,200/泊',
        facilities: ['toilet', 'shower', 'kitchen', 'bbq', 'parking'],
        activities: ['hiking', 'bbq', 'river', 'cycling', 'photography'],
        nearestStationJa: 'JR谷峨駅',
        nearestStationEn: 'JR Yaga Station',
        accessTimeJa: 'バス25分',
        accessTimeEn: '25 min by bus',
        descriptionJa: '森林に囲まれた静かなキャンプ場。清流での川遊びや森林浴を楽しめます。',
        descriptionEn: 'A quiet campsite surrounded by forest. Enjoy river play in clear streams and forest bathing.',
        priceMin: 1800,
        priceMax: 3200,
        reservationUrl: 'https://ashigara-forest.com/booking',
        checkInTime: '13:30',
        checkOutTime: '10:30',
        cancellationPolicyJa: 'キャンセル料：利用日の3日前から30%、当日100%',
        cancellationPolicyEn: 'Cancellation fee: 30% from 3 days before, 100% on the day',
        images: [
          'https://images.unsplash.com/photo-1486022119932-526259183edc?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ]
      }
    ]

    // データベースに挿入（upsert使用で重複を避ける）
    let insertedCount = 0
    let updatedCount = 0

    for (const campsite of sampleCampsites) {
      // 既存のキャンプサイトをチェック
      const existing = await prisma.campsite.findUnique({
        where: { id: campsite.id }
      })

      if (existing) {
        // 更新
        await prisma.campsite.update({
          where: { id: campsite.id },
          data: {
            ...campsite,
            updatedAt: new Date()
          }
        })
        updatedCount++
      } else {
        // 新規挿入
        await prisma.campsite.create({
          data: {
            ...campsite,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        insertedCount++
      }
    }

    // 結果確認
    const totalCampsites = await prisma.campsite.count()

    return NextResponse.json({
      message: 'サンプルデータの挿入が完了しました',
      result: {
        inserted: insertedCount,
        updated: updatedCount,
        total: totalCampsites
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Seed data error:', error)
    return NextResponse.json(
      { 
        error: 'サンプルデータの挿入に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
