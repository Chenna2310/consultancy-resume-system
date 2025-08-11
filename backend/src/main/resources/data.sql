-- Insert default admin user
-- Password is 'admin123' (will be encoded by BCrypt)
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, enabled, created_at)
VALUES ('admin', 'admin@consultancy.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPHzZenm6', 'Admin', 'User', 'ADMIN', true, NOW());

-- Insert default regular user
-- Password is 'user123' (will be encoded by BCrypt)
INSERT IGNORE INTO users (username, email, password, first_name, last_name, role, enabled, created_at)
VALUES ('user', 'user@consultancy.com', '$2a$10$slYQmyNdGzTn7ZcHanWOGuszcUL1KiQpFk8hvDXa/LSFDbSlEd5ie', 'Regular', 'User', 'USER', true, NOW());

-- Insert sample candidates
INSERT IGNORE INTO candidates (full_name, visa_status, city, state, primary_skill, experience_years, contact_info, notes, status, created_at, updated_at, created_by)
VALUES 
('John Doe', 'H1B', 'New York', 'NY', 'Java Developer', 5, 'john.doe@email.com | 555-0101', 'Experienced in Spring Boot and microservices', 'BENCH', NOW(), NOW(), 1),
('Jane Smith', 'GC', 'San Francisco', 'CA', 'React Developer', 3, 'jane.smith@email.com | 555-0102', 'Frontend specialist with Redux experience', 'WORKING', NOW(), NOW(), 1),
('Mike Johnson', 'CITIZEN', 'Austin', 'TX', 'Data Engineer', 7, 'mike.johnson@email.com | 555-0103', 'Expert in Apache Spark and AWS', 'BENCH', NOW(), NOW(), 1),
('Sarah Wilson', 'OPT', 'Seattle', 'WA', 'Full Stack Developer', 2, 'sarah.wilson@email.com | 555-0104', 'Recent graduate with MERN stack experience', 'INTERVIEW', NOW(), NOW(), 1),
('David Brown', 'H1B', 'Chicago', 'IL', 'DevOps Engineer', 6, 'david.brown@email.com | 555-0105', 'Kubernetes and Docker expert', 'PLACED', NOW(), NOW(), 1);