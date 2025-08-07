-- Add check-in/check-out and cancellation policy fields to campsites table

ALTER TABLE campsites ADD COLUMN check_in_time TEXT;
ALTER TABLE campsites ADD COLUMN check_out_time TEXT;
ALTER TABLE campsites ADD COLUMN cancellation_policy_ja TEXT;
ALTER TABLE campsites ADD COLUMN cancellation_policy_en TEXT;
