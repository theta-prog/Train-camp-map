-- 既存のcampsitesテーブルに料金範囲カラムを追加
ALTER TABLE campsites 
ADD COLUMN price_min INTEGER,
ADD COLUMN price_max INTEGER;

-- 既存データの例（必要に応じて更新）
-- UPDATE campsites SET price_min = 2000, price_max = 5000 WHERE price LIKE '%2000%';

-- インデックスを追加してパフォーマンスを向上
CREATE INDEX IF NOT EXISTS idx_campsites_price_range ON campsites(price_min, price_max);
