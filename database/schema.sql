-- PostgreSQL Schema for Solo Parent Information System
-- Run on Render PostgreSQL

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    application_type VARCHAR(20) NOT NULL CHECK (application_type IN ('new', 'renewal')),
    id_number VARCHAR(50),
    expiry_date DATE,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    age INTEGER,
    sex VARCHAR(10) CHECK (sex IN ('Male', 'Female')),
    birthdate DATE,
    birth_place VARCHAR(255),
    address TEXT,
    contact_number VARCHAR(20),
    civil_status VARCHAR(20) NOT NULL CHECK (civil_status IN ('Widow', 'Separated', 'Unwed', 'Others')),
    number_of_dependents INTEGER DEFAULT 0,
    facebook_account VARCHAR(255),
    educational_attainment VARCHAR(50) DEFAULT 'None',
    purpose_of_application VARCHAR(50) NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'Unemployed',
    type_of_employment VARCHAR(50) DEFAULT 'Other',
    other_source_of_income TEXT,
    total_monthly_income DECIMAL(10,2) DEFAULT 0,
    type_of_occupancy VARCHAR(50) DEFAULT 'Own House',
    classification VARCHAR(50) NOT NULL,
    member_4ps BOOLEAN DEFAULT false,
    member_ip BOOLEAN DEFAULT false,
    member_philhealth BOOLEAN DEFAULT false,
    member_sss BOOLEAN DEFAULT false,
    member_gsis BOOLEAN DEFAULT false,
    member_pagibig BOOLEAN DEFAULT false,
    comelec_registered VARCHAR(5) DEFAULT 'No',
    guardian_name VARCHAR(255),
    guardian_relation VARCHAR(100),
    guardian_contact VARCHAR(20),
    zone_leader_name VARCHAR(255),
    zone_leader_contact VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    admin_notes TEXT,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_members (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(100) NOT NULL,
    age INTEGER,
    birthdate DATE,
    educational_attainment VARCHAR(100),
    occupation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(20) DEFAULT 'system',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_affected VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create default admin (password: admin123)
INSERT INTO users (email, password, role) 
VALUES ('admin@barangay.gov.ph', '$2a$10$5mFU0N0Kc8L0J0K0K0K0Ku5J0K0K0K0K0K0K0K0K0K0K0K0K0K0K0', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_user ON applicants(user_id);
CREATE INDEX IF NOT EXISTS idx_applicants_created ON applicants(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_applicant ON family_members(applicant_id);
