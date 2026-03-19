-- MySQL Migration: Create all tables for DigiVents
-- This is the MySQL version of the original PostgreSQL migrations

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Sessions table for JWT refresh tokens
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    refresh_token_hash VARCHAR(255) UNIQUE NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    is_revoked BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_sessions_user_id (user_id),
    KEY idx_sessions_expires_at (expires_at)
);

-- OTP records for email verification
CREATE TABLE IF NOT EXISTS otp_records (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    attempts INT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_otp_records_email (email)
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    instagram_link VARCHAR(255),
    facebook_link VARCHAR(255),
    tiktok_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Creators/Authors table
CREATE TABLE IF NOT EXISTS creators (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    role VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tag VARCHAR(100),
    media JSON,
    cover_photo VARCHAR(255),
    contact VARCHAR(255),
    youtube_link VARCHAR(255),
    instagram_link VARCHAR(255),
    tiktok_link VARCHAR(255),
    facebook_link VARCHAR(255),
    client_id VARCHAR(36),
    client VARCHAR(255),
    category_id VARCHAR(36),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'in-progress', 'completed', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    KEY idx_projects_client_id (client_id),
    KEY idx_projects_category_id (category_id),
    KEY idx_projects_status (status)
);

-- Graphics table
CREATE TABLE IF NOT EXISTS graphics (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    photo VARCHAR(255) NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Contacts table for form submissions
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_contacts_status (status)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255),
    email VARCHAR(255),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    message TEXT,
    project_id VARCHAR(36),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    KEY idx_feedback_project_id (project_id),
    KEY idx_feedback_status (status)
);

-- Workers table
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(100),
    department VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
