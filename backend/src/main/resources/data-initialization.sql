-- Jupiter IT Solutions LLC - Data Initialization
USE consultancy_resume_db;

-- Insert default admin user (Jupiter IT Solutions)
INSERT IGNORE INTO users (id, username, email, password, first_name, last_name, role, enabled, created_at)
VALUES 
(1, 'admin', 'admin@jupiteritsolutions.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPHzZenm6', 'Admin', 'User', 'ADMIN', true, NOW()),
(2, 'user', 'user@jupiteritsolutions.com', '$2a$10$slYQmyNdGzTn7ZcHanWOGuszcUL1KiQpFk8hvDXa/LSFDbSlEd5ie', 'Regular', 'User', 'USER', true, NOW());

-- Insert Jupiter IT Solutions employees
INSERT IGNORE INTO employees (id, full_name, email, phone_number, role, notes, created_at, updated_at, created_by)
VALUES 
(1, 'John Smith', 'john.smith@jupiteritsolutions.com', '(555) 123-4567', 'US_IT_RECRUITER', 'Senior IT Recruiter specializing in Java and .NET technologies', NOW(), NOW(), 1),
(2, 'Sarah Johnson', 'sarah.johnson@jupiteritsolutions.com', '(555) 234-5678', 'ACCOUNT_MANAGER', 'Account Manager for West Coast clients', NOW(), NOW(), 1),
(3, 'Mike Davis', 'mike.davis@jupiteritsolutions.com', '(555) 345-6789', 'US_IT_RECRUITER', 'Recruiter focusing on React and Frontend technologies', NOW(), NOW(), 1),
(4, 'Emily Rodriguez', 'emily.rodriguez@jupiteritsolutions.com', '(555) 456-7890', 'MARKETING', 'Marketing specialist for digital campaigns', NOW(), NOW(), 1);

-- Insert sample bench candidates
INSERT IGNORE INTO bench_candidates (id, full_name, visa_status, city, state, primary_skill, experience_years, phone_number, email, target_rate, notes, created_at, updated_at, created_by, assigned_consultant_id)
VALUES 
(1, 'Rajesh Kumar', 'H1B', 'Dallas', 'TX', 'Java Full Stack Developer', 6, '(555) 567-8901', 'rajesh.kumar@email.com', 85.00, 'Experienced in Spring Boot, React, and AWS', NOW(), NOW(), 1, 1),
(2, 'Priya Sharma', 'OPT', 'Austin', 'TX', 'React Developer', 3, '(555) 678-9012', 'priya.sharma@email.com', 70.00, 'Frontend specialist with Redux and TypeScript', NOW(), NOW(), 1, 3),
(3, 'David Chen', 'GC', 'Houston', 'TX', 'Data Engineer', 8, '(555) 789-0123', 'david.chen@email.com', 95.00, 'Expert in Apache Spark, Python, and Snowflake', NOW(), NOW(), 1, 1),
(4, 'Maria Lopez', 'CITIZEN', 'San Antonio', 'TX', 'DevOps Engineer', 5, '(555) 890-1234', 'maria.lopez@email.com', 80.00, 'Kubernetes, Docker, and CI/CD specialist', NOW(), NOW(), 1, 1),
(5, 'Ahmed Hassan', 'H1B', 'Plano', 'TX', '.NET Developer', 4, '(555) 901-2345', 'ahmed.hassan@email.com', 75.00, 'C#, ASP.NET Core, and Azure experience', NOW(), NOW(), 1, 1);

-- Insert sample working candidates
INSERT IGNORE INTO working_candidates (id, full_name, visa_status, working_location, job_role, experience_years, email, phone_number, hourly_rate, project_duration, client_name, notes, created_at, updated_at, created_by, placed_by)
VALUES 
(1, 'Ankit Patel', 'H1B', 'Remote', 'Senior Java Developer', 7, 'ankit.patel@email.com', '(555) 111-2222', 90.00, '12 months', 'Microsoft', 'Working on Azure cloud migration project', NOW(), NOW(), 1, 1),
(2, 'Jennifer Wang', 'GC', 'New York, NY', 'React Team Lead', 6, 'jennifer.wang@email.com', '(555) 222-3333', 95.00, '18 months', 'Goldman Sachs', 'Leading frontend development team', NOW(), NOW(), 1, 3),
(3, 'Carlos Rodriguez', 'CITIZEN', 'San Francisco, CA', 'Data Scientist', 5, 'carlos.rodriguez@email.com', '(555) 333-4444', 100.00, '6 months', 'Google', 'Machine learning model development', NOW(), NOW(), 1, 1);

-- Insert sample vendors
INSERT IGNORE INTO vendors (id, company_name, primary_contact_name, primary_contact_email, primary_contact_phone, city, state, preferred_skills, rate_range_min, rate_range_max, total_submissions, successful_placements, status, notes, created_at, updated_at, created_by)
VALUES 
(1, 'TechCorp Solutions', 'Robert Smith', 'robert.smith@techcorp.com', '(555) 444-5555', 'Dallas', 'TX', 'Java, Spring Boot, Microservices', 70.00, 120.00, 15, 8, 'ACTIVE', 'Reliable client with consistent requirements', NOW(), NOW(), 1),
(2, 'InnovateTech Inc', 'Lisa Johnson', 'lisa.johnson@innovatetech.com', '(555) 555-6666', 'Austin', 'TX', 'React, Angular, Vue.js', 65.00, 100.00, 12, 7, 'PREFERRED', 'Preferred vendor for frontend projects', NOW(), NOW(), 1),
(3, 'DataDriven LLC', 'Michael Brown', 'michael.brown@datadriven.com', '(555) 666-7777', 'Houston', 'TX', 'Python, SQL, AWS, Snowflake', 80.00, 130.00, 8, 5, 'ACTIVE', 'Specializes in data engineering roles', NOW(), NOW(), 1);

-- Reset auto increment to continue from proper values
ALTER TABLE users AUTO_INCREMENT = 3;
ALTER TABLE employees AUTO_INCREMENT = 5;
ALTER TABLE bench_candidates AUTO_INCREMENT = 6;
ALTER TABLE working_candidates AUTO_INCREMENT = 4;
ALTER TABLE vendors AUTO_INCREMENT = 4;