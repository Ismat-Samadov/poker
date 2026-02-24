-- Initial schema creation for cashback dashboard
-- Version: 001
-- Date: 2024-02-24
-- Description: Creates cashback schema with separate tables for each bank

-- Create cashback schema
CREATE SCHEMA IF NOT EXISTS cashback;

-- =============================================================================
-- METADATA TABLES
-- =============================================================================

-- Banks metadata table
CREATE TABLE cashback.banks (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    website_url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE cashback.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- BANK-SPECIFIC OFFER TABLES
-- =============================================================================

-- ABB Bank offers
CREATE TABLE cashback.abb_bank (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unibank offers
CREATE TABLE cashback.unibank (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Access Bank offers
CREATE TABLE cashback.access_bank (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATB Bank offers
CREATE TABLE cashback.atb_bank (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank of Baku offers
CREATE TABLE cashback.bank_of_baku (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rabita Bank offers
CREATE TABLE cashback.rabita_bank (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Yelo Bank offers
CREATE TABLE cashback.yelo_bank (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id) ON DELETE SET NULL,
    merchant_name VARCHAR(200) NOT NULL,
    cashback_percentage DECIMAL(5,2),
    cashback_amount DECIMAL(10,2),
    description TEXT,
    terms TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SCRAPING LOGS TABLE
-- =============================================================================

CREATE TABLE cashback.scraping_logs (
    id SERIAL PRIMARY KEY,
    bank_table_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    offers_found INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- ABB Bank indexes
CREATE INDEX idx_abb_bank_category_id ON cashback.abb_bank(category_id);
CREATE INDEX idx_abb_bank_is_active ON cashback.abb_bank(is_active);
CREATE INDEX idx_abb_bank_scraped_at ON cashback.abb_bank(scraped_at);
CREATE INDEX idx_abb_bank_merchant_name ON cashback.abb_bank(merchant_name);

-- Unibank indexes
CREATE INDEX idx_unibank_category_id ON cashback.unibank(category_id);
CREATE INDEX idx_unibank_is_active ON cashback.unibank(is_active);
CREATE INDEX idx_unibank_scraped_at ON cashback.unibank(scraped_at);
CREATE INDEX idx_unibank_merchant_name ON cashback.unibank(merchant_name);

-- Access Bank indexes
CREATE INDEX idx_access_bank_category_id ON cashback.access_bank(category_id);
CREATE INDEX idx_access_bank_is_active ON cashback.access_bank(is_active);
CREATE INDEX idx_access_bank_scraped_at ON cashback.access_bank(scraped_at);
CREATE INDEX idx_access_bank_merchant_name ON cashback.access_bank(merchant_name);

-- ATB Bank indexes
CREATE INDEX idx_atb_bank_category_id ON cashback.atb_bank(category_id);
CREATE INDEX idx_atb_bank_is_active ON cashback.atb_bank(is_active);
CREATE INDEX idx_atb_bank_scraped_at ON cashback.atb_bank(scraped_at);
CREATE INDEX idx_atb_bank_merchant_name ON cashback.atb_bank(merchant_name);

-- Bank of Baku indexes
CREATE INDEX idx_bank_of_baku_category_id ON cashback.bank_of_baku(category_id);
CREATE INDEX idx_bank_of_baku_is_active ON cashback.bank_of_baku(is_active);
CREATE INDEX idx_bank_of_baku_scraped_at ON cashback.bank_of_baku(scraped_at);
CREATE INDEX idx_bank_of_baku_merchant_name ON cashback.bank_of_baku(merchant_name);

-- Rabita Bank indexes
CREATE INDEX idx_rabita_bank_category_id ON cashback.rabita_bank(category_id);
CREATE INDEX idx_rabita_bank_is_active ON cashback.rabita_bank(is_active);
CREATE INDEX idx_rabita_bank_scraped_at ON cashback.rabita_bank(scraped_at);
CREATE INDEX idx_rabita_bank_merchant_name ON cashback.rabita_bank(merchant_name);

-- Yelo Bank indexes
CREATE INDEX idx_yelo_bank_category_id ON cashback.yelo_bank(category_id);
CREATE INDEX idx_yelo_bank_is_active ON cashback.yelo_bank(is_active);
CREATE INDEX idx_yelo_bank_scraped_at ON cashback.yelo_bank(scraped_at);
CREATE INDEX idx_yelo_bank_merchant_name ON cashback.yelo_bank(merchant_name);

-- Scraping logs indexes
CREATE INDEX idx_scraping_logs_bank_table ON cashback.scraping_logs(bank_table_name);
CREATE INDEX idx_scraping_logs_started_at ON cashback.scraping_logs(started_at);
