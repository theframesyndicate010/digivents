-- 003_new_schema.sql
-- Adds dynamic testimonials storage and client logo support.
-- Every statement is idempotent so this file is safe to re-run against an
-- existing volume (docker-compose only replays initdb scripts on first boot).

-- Dynamic testimonials (replaces the hardcoded array in the frontend)
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  avatar VARCHAR(500),
  position INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_active_position (is_active, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Client logo. The frontend already reads `client.logo`, so this closes the gap.
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

-- Seed the testimonials that were previously hardcoded in the frontend.
-- avatar is left NULL: the images live in the frontend bundle, not in public/uploads.
INSERT INTO testimonials (id, name, text, avatar, position, is_active) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Bednidhi Traders', 'We wanted to improve our online presence and reach more customers. Digivents helped us with digital marketing and the results have been very positive for our business.', NULL, 0, 1),
  ('22222222-2222-4222-8222-222222222222', 'Advance Pain Specialist Clinic', 'Working with Digivents has been a smooth experience. They helped us grow our visibility online and connect with more people who need our services', NULL, 1, 1),
  ('33333333-3333-4333-8333-333333333333', 'Shivam Housing', 'Our social media presence has improved a lot. We are now reaching the right audience for our housing projects', NULL, 2, 1),
  ('44444444-4444-4444-8444-444444444444', 'Jhapa Gold Cup', 'With Digivents'' support, our match updates and schedules reached fans instantly. The engagement this season was outstanding.', NULL, 3, 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name), text = VALUES(text), position = VALUES(position);