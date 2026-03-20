-- PostgreSQL Migration: Insert initial data for DigiVents
-- [ADMIN USER ONLY - All dummy data has been removed]

-- Restore admin user account
INSERT INTO users (email, password_hash, is_verified, role) VALUES 
('admin@digivents.com', '$2b$10$2NAWQ8xddj6aPr.z7QcPjuPH5yyEfYX0NISsZIklPiJCJK1TO6jvy', true, 'admin')
ON CONFLICT (email) DO NOTHING;