const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // テストキャンプサイトデータ
  const campsites = [
    {
      nameJa: '富士山キャンプ場',
      nameEn: 'Mount Fuji Campsite',
      lat: 35.3606,
      lng: 138.7274,
      addressJa: '静岡県富士宮市',
      addressEn: 'Fujinomiya, Shizuoka',
      phone: '0544-12-3456',
      website: 'https://example.com/fuji-camp',
      price: '3,000-5,000円',
      nearestStationJa: '富士宮駅',
      nearestStationEn: 'Fujinomiya Station',
      accessTimeJa: '徒歩15分',
      accessTimeEn: '15 min walk',
      descriptionJa: '富士山の美しい景色が楽しめるキャンプ場です。',
      descriptionEn: 'Campsite with beautiful Mount Fuji views.',
      facilities: JSON.stringify(['トイレ', 'シャワー', '炊事場', '駐車場']),
      activities: JSON.stringify(['ハイキング', '星空観察', 'バーベキュー']),
      images: JSON.stringify(['/images/fuji-camp-1.jpg', '/images/fuji-camp-2.jpg']),
      priceMin: 3000,
      priceMax: 5000,
      reservationUrl: 'https://example.com/fuji-camp',
      reservationPhone: '0544-12-3456'
    },
    {
      nameJa: '湖畔リゾートキャンプ',
      nameEn: 'Lakeside Resort Camp',
      lat: 36.0502,
      lng: 138.1140,
      addressJa: '長野県諏訪市',
      addressEn: 'Suwa, Nagano',
      phone: '0266-78-9012',
      website: 'https://example.com/lake-camp',
      price: '4,000-7,000円',
      nearestStationJa: '上諏訪駅',
      nearestStationEn: 'Kami-Suwa Station',
      accessTimeJa: '車で10分',
      accessTimeEn: '10 min by car',
      descriptionJa: '湖の畔で静かなキャンプが楽しめます。',
      descriptionEn: 'Quiet camping by the lake.',
      facilities: JSON.stringify(['トイレ', 'シャワー', 'コインランドリー', 'レストラン']),
      activities: JSON.stringify(['釣り', 'カヌー', 'ハイキング', '温泉']),
      images: JSON.stringify(['/images/lake-camp-1.jpg']),
      priceMin: 4000,
      priceMax: 7000,
      reservationUrl: 'https://example.com/lake-camp',
      reservationPhone: '0266-78-9012'
    },
    {
      nameJa: '森林キャンプグラウンド',
      nameEn: 'Forest Campground',
      lat: 36.7000,
      lng: 138.9000,
      addressJa: '群馬県みなかみ町',
      addressEn: 'Minakami, Gunma',
      phone: '0278-34-5678',
      price: '2,500-4,000円',
      nearestStationJa: '水上駅',
      nearestStationEn: 'Minakami Station',
      accessTimeJa: 'バスで20分',
      accessTimeEn: '20 min by bus',
      descriptionJa: '豊かな自然に囲まれた森の中のキャンプ場。',
      descriptionEn: 'Campground surrounded by rich nature.',
      facilities: JSON.stringify(['トイレ', '炊事場', '駐車場']),
      activities: JSON.stringify(['森林浴', 'ハイキング', '野鳥観察']),
      images: JSON.stringify(['/images/forest-camp-1.jpg', '/images/forest-camp-2.jpg', '/images/forest-camp-3.jpg']),
      priceMin: 2500,
      priceMax: 4000,
      reservationPhone: '0278-34-5678'
    }
  ]

  // キャンプサイトを作成
  for (const campsite of campsites) {
    await prisma.campsite.create({
      data: campsite
    })
    console.log(`✅ Created campsite: ${campsite.nameJa}`)
  }

  console.log('🎉 Seeding completed!')
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
