-- キャンプ場テーブルに画像配列カラムを追加
ALTER TABLE campsites 
ADD COLUMN images TEXT[];

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_campsites_images ON campsites USING GIN(images);

-- 既存データの例（必要に応じて更新）
-- UPDATE campsites SET images = ARRAY[
--   'https://example.com/campsite1/image1.jpg',
--   'https://example.com/campsite1/image2.jpg',
--   'https://example.com/campsite1/image3.jpg'
-- ] WHERE id = 'example-id';
