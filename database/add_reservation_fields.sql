-- キャンプ場テーブルに予約サイトと追加情報のカラムを追加
ALTER TABLE campsites 
ADD COLUMN reservation_url TEXT,
ADD COLUMN check_in_time VARCHAR(50),
ADD COLUMN check_out_time VARCHAR(50),
ADD COLUMN cancellation_policy TEXT;

-- 既存データの例（必要に応じて更新）
-- UPDATE campsites SET 
--   reservation_url = 'https://example.com/reserve',
--   check_in_time = '14:00',
--   check_out_time = '11:00',
--   cancellation_policy = 'キャンセル料金についてはお問い合わせください'
-- WHERE id = 'example-id';

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_campsites_reservation ON campsites(reservation_url);
