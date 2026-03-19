-- Insert admin user (password will be: Admin@123456)
-- Note: In production, you should use Supabase Auth instead of custom password hashing
INSERT INTO users (email, password_hash, is_verified, role) VALUES 
('admin@digivents.com', '$2b$10$2NAWQ8xddj6aPr.z7QcPjuPH5yyEfYX0NISsZIklPiJCJK1TO6jvy', true, 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Web Development', 'Website and web application projects'),
('Mobile Apps', 'iOS and Android mobile applications'),
('Branding', 'Logo design and brand identity projects'),
('Digital Marketing', 'Social media and digital marketing campaigns'),
('UI/UX Design', 'User interface and user experience design')
ON CONFLICT DO NOTHING;

-- Insert sample clients
INSERT INTO clients (name, website, instagram_link, facebook_link) VALUES 
('Tech Startup Inc', 'https://techstartup.com', 'https://instagram.com/techstartup', 'https://facebook.com/techstartup'),
('Creative Agency', 'https://creativeagency.com', 'https://instagram.com/creativeagency', 'https://facebook.com/creativeagency'),
('E-commerce Store', 'https://ecomstore.com', 'https://instagram.com/ecomstore', 'https://facebook.com/ecomstore')
ON CONFLICT DO NOTHING;

-- Insert sample creators/team members
INSERT INTO creators (name, role, description) VALUES 
('John Doe', 'Lead Developer', 'Full-stack developer with 5+ years experience'),
('Jane Smith', 'UI/UX Designer', 'Creative designer specializing in user experience'),
('Mike Johnson', 'Project Manager', 'Experienced project manager and team lead'),
('Sarah Wilson', 'Content Creator', 'Social media and content marketing specialist')
ON CONFLICT DO NOTHING;

-- Insert sample projects (using client names for backward compatibility)
INSERT INTO projects (name, description, tag, client, status) VALUES 
('E-commerce Platform', 'Modern e-commerce platform with advanced features', 'Web Development', 'E-commerce Store', 'completed'),
('Mobile Banking App', 'Secure mobile banking application for iOS and Android', 'Mobile Development', 'Tech Startup Inc', 'in-progress'),
('Brand Identity Package', 'Complete brand identity design including logo and guidelines', 'Branding', 'Creative Agency', 'active'),
('Social Media Campaign', 'Digital marketing campaign for product launch', 'Marketing', 'Tech Startup Inc', 'completed')
ON CONFLICT DO NOTHING;

-- Insert sample graphics
INSERT INTO graphics (name, description, photo) VALUES 
('Hero Banner Design', 'Modern hero banner for website homepage', '/uploads/graphics/hero-banner.jpg'),
('Logo Collection', 'Collection of logo designs for various clients', '/uploads/graphics/logo-collection.jpg'),
('Social Media Templates', 'Instagram and Facebook post templates', '/uploads/graphics/social-templates.jpg')
ON CONFLICT DO NOTHING;

-- Insert sample contact messages
INSERT INTO contacts (name, email, subject, message, status) VALUES 
('Alice Brown', 'alice@example.com', 'Project Inquiry', 'Hi, I would like to discuss a web development project for my business.', 'new'),
('Bob Davis', 'bob@example.com', 'Collaboration', 'Interested in collaborating on a mobile app project.', 'read'),
('Carol White', 'carol@example.com', 'Design Services', 'Looking for UI/UX design services for our startup.', 'replied')
ON CONFLICT DO NOTHING;

-- Insert sample feedback
INSERT INTO feedback (name, email, rating, message, status) VALUES 
('Happy Client', 'client1@example.com', 5, 'Excellent work on our website! Very professional team.', 'approved'),
('Satisfied Customer', 'client2@example.com', 4, 'Great communication and timely delivery. Highly recommended.', 'approved'),
('Another Client', 'client3@example.com', 5, 'Outstanding design work. Exceeded our expectations!', 'pending')
ON CONFLICT DO NOTHING;