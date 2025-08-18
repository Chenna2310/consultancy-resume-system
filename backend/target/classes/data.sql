-- Jupiter IT Solutions LLC - Initial Data
-- This file runs automatically when the application starts

-- Insert default admin user if not exists
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, enabled, created_at)
VALUES ('admin', 'admin@jupiteritsolutions.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPHzZenm6', 'Admin', 'User', 'ADMIN', true, NOW());

-- Insert default regular user if not exists
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, enabled, created_at)
VALUES ('user', 'user@jupiteritsolutions.com', '$2a$10$slYQmyNdGzTn7ZcHanWOGuszcUL1KiQpFk8hvDXa/LSFDbSlEd5ie', 'Regular', 'User', 'USER', true, NOW());