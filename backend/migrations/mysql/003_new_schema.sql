-- ============================================================================
-- 003_new_schema.sql
-- Adds dynamic testimonials storage + client logo support.
--
-- Every statement is idempotent, so this file is safe to re-run against an
-- existing volume (docker-compose only replays initdb scripts on first boot).
-- ============================================================================


-- ============================================================================
-- 1. TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  avatar VARCHAR(500) NULL,
  position INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_active_position (is_active, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notes:
--   position   lower number = shown first in the carousel
--   is_active  1 = shown on the public site, 0 = hidden (still editable in admin)
--   avatar     path stored relative to public/, e.g. '/uploads/images/abc.png'
--              Leave NULL and the site shows the person's initial letter.


-- ============================================================================
-- 2. CLIENT LOGO COLUMN
-- ----------------------------------------------------------------------------
-- The frontend already reads `client.logo`, so this closes the gap.
-- ============================================================================
SET @clients_has_logo := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clients' AND COLUMN_NAME = 'logo'
);
SET @add_clients_logo := IF(
  @clients_has_logo > 0 OR NOT EXISTS (SELECT 1 FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clients'),
  'SELECT 1', 'ALTER TABLE clients ADD COLUMN logo VARCHAR(500) NULL'
);
PREPARE stmt FROM @add_clients_logo;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============================================================================
-- 3. DEFAULT TESTIMONIALS
-- ----------------------------------------------------------------------------
-- The four entries that used to be hardcoded in the frontend.
-- avatar is NULL: those images live in the frontend bundle, not in public/uploads,
-- so until you upload a photo the site shows the person's initial letter.
--
-- Fixed ids + ON DUPLICATE KEY UPDATE => re-running refreshes these four without
-- ever touching testimonials you added yourself.
-- ============================================================================
INSERT INTO testimonials (id, name, text, avatar, position, is_active) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Bednidhi Traders',
   'We wanted to improve our online presence and reach more customers. Digivents helped us with digital marketing and the results have been very positive for our business.',
   NULL, 0, 1),
  ('22222222-2222-4222-8222-222222222222', 'Advance Pain Specialist Clinic',
   'Working with Digivents has been a smooth experience. They helped us grow our visibility online and connect with more people who need our services',
   NULL, 1, 1),
  ('33333333-3333-4333-8333-333333333333', 'Shivam Housing',
   'Our social media presence has improved a lot. We are now reaching the right audience for our housing projects',
   NULL, 2, 1),
  ('44444444-4444-4444-8444-444444444444', 'Jhapa Gold Cup',
   'With Digivents'' support, our match updates and schedules reached fans instantly. The engagement this season was outstanding.',
   NULL, 3, 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name), text = VALUES(text), position = VALUES(position);


-- ============================================================================
-- 4. ADDING YOUR OWN TESTIMONIALS MANUALLY
-- ----------------------------------------------------------------------------
-- Either use the admin panel (Content > Testimonials), or paste the INSERT
-- below into phpMyAdmin / mysql CLI and edit the values.
--
-- UUID() generates a fresh id, so this never collides with anything.
-- position 0 = first, 1 = second, and so on.
-- For avatar, either use NULL or a path that exists under backend/public/,
-- e.g. '/uploads/images/my-client.jpg'
--
--   INSERT INTO testimonials (id, name, text, avatar, position, is_active) VALUES
--     (UUID(), 'Client Name', 'What the client said', NULL, 4, 1);
--
-- Add several at once:
--
--   INSERT INTO testimonials (id, name, text, avatar, position, is_active) VALUES
--     (UUID(), 'Client One',  'First quote',  NULL, 4, 1),
--     (UUID(), 'Client Two',  'Second quote', NULL, 5, 1),
--     (UUID(), 'Client Three','Third quote',  NULL, 6, 0);
--
-- Hide one without deleting it:
--
--   UPDATE testimonials SET is_active = 0 WHERE name = 'Client One';
--
-- Change the carousel order:
--
--   UPDATE testimonials SET position = 2 WHERE name = 'Client One';
--
-- Attach a photo that already exists in backend/public/uploads/images/:
--
--   UPDATE testimonials
--      SET avatar = '/uploads/images/jhapagoldcup.jpg'
--    WHERE name = 'Jhapa Gold Cup';
--
-- Delete:
--
--   DELETE FROM testimonials WHERE name = 'Client One';
--
-- Check what is live on the site:
--
--   SELECT id, name, position, avatar, is_active
--     FROM testimonials WHERE is_active = 1 ORDER BY position;
-- ============================================================================