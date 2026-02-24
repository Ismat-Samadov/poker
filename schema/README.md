# Database Schema

This directory contains SQL migration scripts for the cashback dashboard database.

## Schema Overview

**Database:** `neondb`
**Schema:** `cashback`

### Tables

#### Metadata Tables
- `cashback.banks` - Bank metadata and configuration
- `cashback.categories` - Cashback offer categories
- `cashback.scraping_logs` - Scraping job history

#### Bank-Specific Offer Tables
Each bank has its own table to store cashback offers:
- `cashback.abb_bank`
- `cashback.unibank`
- `cashback.access_bank`
- `cashback.atb_bank`
- `cashback.bank_of_baku`
- `cashback.rabita_bank`
- `cashback.yelo_bank`

## Migrations

Migrations are numbered sequentially and should be applied in order:

1. **001_init_schema.sql** - Creates all tables, indexes, and constraints
2. **002_seed_data.sql** - Inserts initial banks and categories

## Applying Migrations

### Using psql

```bash
# Set environment variable
export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Apply a specific migration
psql $DATABASE_URL -f schema/001_init_schema.sql
psql $DATABASE_URL -f schema/002_seed_data.sql
```

### Using Python

```bash
# Run the init_db.py script (includes both schema and seed data)
python3 scripts/init_db.py
```

## Schema Changes

When making schema changes:

1. Create a new migration file with incremented number (e.g., `003_add_column.sql`)
2. Document the changes in the file header
3. Update this README with the new migration
4. Test the migration on a development database first

## Example Migration

```sql
-- 003_add_bank_logo.sql
-- Version: 003
-- Date: 2024-XX-XX
-- Description: Adds logo_url column to banks table

ALTER TABLE cashback.banks
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
```

## Rollback Strategy

For critical changes, create a corresponding rollback file:

```sql
-- 003_add_bank_logo_rollback.sql
ALTER TABLE cashback.banks
DROP COLUMN IF EXISTS logo_url;
```

## Database Structure

### Offer Table Schema

All bank-specific tables share the same structure:

```sql
CREATE TABLE cashback.{bank_name} (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES cashback.categories(id),
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
```

## Indexes

Each offer table has indexes on:
- `category_id` - For category filtering
- `is_active` - For active offer queries
- `scraped_at` - For temporal queries
- `merchant_name` - For merchant search
