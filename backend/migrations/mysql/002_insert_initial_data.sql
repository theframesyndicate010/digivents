-- MySQL Migration: Insert initial data for DigiVents
-- [ADMIN USER ONLY - All dummy data has been removed]

-- Restore admin user account
INSERT IGNORE INTO users (id, email, password_hash, is_verified, role) VALUES 
(UUID(), 'admin@digivents.com', '$2b$10$2NAWQ8xddj6aPr.z7QcPjuPH5yyEfYX0NISsZIklPiJCJK1TO6jvy', true, 'admin');
