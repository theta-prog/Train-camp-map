const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ymdjulwkwoppfkbtnqnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZGp1bHdrd29wcGZrYnRucW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjU4MjMsImV4cCI6MjA2NjA0MTgyM30.mQFEf29IpgRXtlNISG5SqUvdkMtyNoedePtW0vwGQAQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// facilityMapper.tsと同様のマッピング
const FACILITY_MAPPING = {
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
};

const ACTIVITY_MAPPING = {
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
  '電車見学': 'train'
};

function mapFacility(facility) {
  return FACILITY_MAPPING[facility] || facility;
}

function mapActivity(activity) {
  return ACTIVITY_MAPPING[activity] || activity;
}

(async () => {
  try {
    // 全データを取得
    const { data, error } = await supabase
      .from('campsites')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log(`Found ${data.length} campsites to update`);
    
    // 各キャンプ場を更新
    for (const campsite of data) {
      const updatedFacilities = campsite.facilities.map(mapFacility);
      const updatedActivities = campsite.activities.map(mapActivity);
      
      const { error: updateError } = await supabase
        .from('campsites')
        .update({
          facilities: updatedFacilities,
          activities: updatedActivities,
          updated_at: new Date().toISOString()
        })
        .eq('id', campsite.id);
      
      if (updateError) {
        console.error(`Error updating ${campsite.name_ja}:`, updateError);
      } else {
        console.log(`Updated ${campsite.name_ja}`);
      }
    }
    
    console.log('Database update completed');
  } catch (err) {
    console.error('Exception:', err);
  }
})();
