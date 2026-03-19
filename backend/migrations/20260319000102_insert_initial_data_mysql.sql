-- MySQL Migration: Insert initial data for DigiVents
-- This is the MySQL version of the initial data migration

-- Insert admin user (password will be: Admin@123456)
INSERT IGNORE INTO users (id, email, password_hash, is_verified, role) VALUES 
(UUID(), 'admin@digivents.com', '$2b$10$2NAWQ8xddj6aPr.z7QcPjuPH5yyEfYX0NISsZIklPiJCJK1TO6jvy', true, 'admin');

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, description) VALUES 
(UUID(), 'Web Development', 'Website and web application projects'),
(UUID(), 'Mobile Apps', 'iOS and Android mobile applications'),
(UUID(), 'Branding', 'Logo design and brand identity projects'),
(UUID(), 'Digital Marketing', 'Social media and digital marketing campaigns'),
(UUID(), 'UI/UX Design', 'User interface and user experience design');

-- Insert sample clients
INSERT IGNORE INTO clients (id, name, website, instagram_link, facebook_link) VALUES 
(UUID(), 'Tech Startup Inc', 'https://techstartup.com', 'https://instagram.com/techstartup', 'https://facebook.com/techstartup'),
(UUID(), 'Creative Agency', 'https://creativeagency.com', 'https://instagram.com/creativeagency', 'https://facebook.com/creativeagency'),
(UUID(), 'E-commerce Store', 'https://ecomstore.com', 'https://instagram.com/ecomstore', 'https://facebook.com/ecomstore');

-- Insert sample creators/team members
INSERT IGNORE INTO creators (id, name, role, description) VALUES 
(UUID(), 'John Doe', 'Lead Developer', 'Full-stack developer with 5+ years experience'),
(UUID(), 'Jane Smith', 'UI/UX Designer', 'Creative designer specializing in user experience'),
(UUID(), 'Mike Johnson', 'Project Manager', 'Experienced project manager and team lead'),
(UUID(), 'Sarah Wilson', 'Content Creator', 'Social media and content marketing specialist');

-- Insert sample projects (using client names for backward compatibility)
INSERT IGNORE INTO projects (id, name, description, tag, client, status) VALUES 
(UUID(), 'E-commerce Platform', 'Modern e-commerce platform with advanced features', 'Web Development', 'E-commerce Store', 'completed'),
(UUID(), 'Mobile Banking App', 'Secure mobile banking application for iOS and Android', 'Mobile Development', 'Tech Startup Inc', 'in-progress'),
(UUID(), 'Brand Identity Package', 'Complete brand identity design including logo and guidelines', 'Branding', 'Creative Agency', 'active'),
(UUID(), 'Social Media Campaign', 'Digital marketing campaign for product launch', 'Marketing', 'Tech Startup Inc', 'completed');

-- Insert sample graphics
INSERT IGNORE INTO graphics (id, name, description, photo) VALUES 
(UUID(), 'Hero Banner Design', 'Modern hero banner for website homepage', '/uploads/graphics/hero-banner.jpg'),
(UUID(), 'Logo Collection', 'Collection of logo designs for various clients', '/uploads/graphics/logo-collection.jpg'),
(UUID(), 'Social Media Templates', 'Instagram and Facebook post templates', '/uploads/graphics/social-templates.jpg');

-- Insert sample contact messages
INSERT IGNORE INTO contacts (id, name, email, subject, message, status) VALUES 
(UUID(), 'Alice Brown', 'alice@example.com', 'Project Inquiry', 'Hi, I would like to discuss a web development project for my business.', 'new'),
(UUID(), 'Bob Davis', 'bob@example.com', 'Collaboration', 'Interested in collaborating on a mobile app project.', 'read'),
(UUID(), 'Carol White', 'carol@example.com', 'Design Services', 'Looking for UI/UX design services for our startup.', 'replied');

-- Insert sample feedback
INSERT IGNORE INTO feedback (id, name, email, rating, message, status) VALUES 
(UUID(), 'Happy Client', 'client1@example.com', 5, 'Excellent work on our website! Very professional team.', 'approved'),
(UUID(), 'Satisfied Customer', 'client2@example.com', 4, 'Great communication and timely delivery. Highly recommended.', 'approved'),
(UUID(), 'Another Client', 'client3@example.com', 5, 'Outstanding design work. Exceeded our expectations!', 'pending');
