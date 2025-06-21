-- キャンプ場テーブルの作成
CREATE TABLE campsites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ja VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  address_ja VARCHAR(200) NOT NULL,
  address_en VARCHAR(200),
  phone VARCHAR(50),
  website VARCHAR(500),
  price VARCHAR(50) NOT NULL,
  nearest_station_ja VARCHAR(100) NOT NULL,
  nearest_station_en VARCHAR(100),
  access_time_ja VARCHAR(100) NOT NULL,
  access_time_en VARCHAR(100),
  description_ja TEXT NOT NULL,
  description_en TEXT,
  facilities TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの追加
CREATE INDEX idx_campsites_name_ja ON campsites(name_ja);
CREATE INDEX idx_campsites_location ON campsites(lat, lng);
CREATE INDEX idx_campsites_created_at ON campsites(created_at);

-- Row Level Security (RLS) の有効化
ALTER TABLE campsites ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシー（誰でも読める）
CREATE POLICY "Anyone can view campsites" ON campsites
  FOR SELECT USING (true);

-- 管理者のみ作成・更新・削除可能（後で認証実装時に改善）
CREATE POLICY "Admin can insert campsites" ON campsites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update campsites" ON campsites
  FOR UPDATE USING (true);

CREATE POLICY "Admin can delete campsites" ON campsites
  FOR DELETE USING (true);

-- サンプルデータの挿入
INSERT INTO campsites (
  name_ja, name_en, lat, lng, address_ja, address_en,
  phone, website, price, nearest_station_ja, nearest_station_en,
  access_time_ja, access_time_en, description_ja, description_en,
  facilities, activities
) VALUES 
(
  '高尾山キャンプ場', 'Takao Mountain Campsite',
  35.6762, 139.6503,
  '東京都八王子市高尾町', 'Takao-cho, Hachioji-shi, Tokyo',
  '042-123-4567', 'https://takao-camp.example.com',
  '¥2,000/泊', 'JR高尾駅', 'JR Takao Station',
  '徒歩15分', '15 min walk',
  '高尾山の麓にある自然豊かなキャンプ場です。ハイキングの拠点としても最適で、都心からのアクセスも良好です。',
  'A nature-rich campsite at the foot of Mount Takao. Perfect as a base for hiking and easily accessible from central Tokyo.',
  ARRAY['restroom', 'shower', 'parking', 'wifi'],
  ARRAY['hiking', 'photography', 'stargazing']
),
(
  '奥多摩湖キャンプ場', 'Lake Okutama Campsite',
  35.7745, 139.0947,
  '東京都奥多摩町氷川', 'Hikawa, Okutama-machi, Tokyo',
  '0428-987-6543', 'https://okutama-camp.example.com',
  '¥3,500/泊', 'JR奥多摩駅', 'JR Okutama Station',
  'バス25分', '25 min by bus',
  '奥多摩湖のほとりにある美しいキャンプ場。釣りやボート遊びが楽しめ、四季折々の自然を満喫できます。',
  'A beautiful campsite by Lake Okutama. Enjoy fishing and boating while experiencing nature through all four seasons.',
  ARRAY['restroom', 'shower', 'parking', 'bbq', 'store'],
  ARRAY['fishing', 'boating', 'hiking', 'photography']
);

-- updated_at の自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at の自動更新トリガー
CREATE TRIGGER update_campsites_updated_at
  BEFORE UPDATE ON campsites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
