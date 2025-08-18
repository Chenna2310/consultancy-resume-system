-- Jupiter IT Solutions LLC - Database Backup Script
-- Run this to backup your current data

-- Backup users
SELECT 'USERS BACKUP:' as info;
SELECT * FROM users;

-- Backup employees  
SELECT 'EMPLOYEES BACKUP:' as info;
SELECT * FROM employees;

-- Backup bench candidates
SELECT 'BENCH CANDIDATES BACKUP:' as info;
SELECT * FROM bench_candidates;

-- Backup working candidates
SELECT 'WORKING CANDIDATES BACKUP:' as info;
SELECT * FROM working_candidates;

-- Backup vendors
SELECT 'VENDORS BACKUP:' as info;
SELECT * FROM vendors;