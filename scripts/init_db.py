#!/usr/bin/env python3
"""
Initialize the database schema for cashback scraper
Creates the 'cashback' schema with separate table for each bank
"""

import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_schema():
    """Create the cashback schema and tables"""

    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')

    if not database_url:
        raise ValueError("DATABASE_URL not found in environment variables")

    print("Connecting to database...")
    conn = psycopg2.connect(database_url)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # Bank configurations
    banks = [
        ('abb_bank', 'ABB Bank', 'https://abb-bank.az/ferdi/kesbek/faydali-kesbek'),
        ('unibank', 'Unibank', 'https://unibank.az/az/cards/cashback'),
        ('access_bank', 'Access Bank', 'https://www.accessbank.az/az/private/cards/mycard/white/'),
        ('atb_bank', 'ATB Bank', 'https://atb.az/brands/'),
        ('bank_of_baku', 'Bank of Baku', 'https://www.bankofbaku.com/az/kampaniyalar/bolkartda-kesbek-boldur'),
        ('rabita_bank', 'Rabita Bank', 'https://www.rabitabank.com/ferdi/kesbek-1'),
        ('yelo_bank', 'Yelo Bank', 'https://www.yelo.az/az/individuals/cashback/')
    ]

    try:
        # Drop existing schema if needed (careful - this deletes all data!)
        print("Checking for existing cashback schema...")
        cur.execute("""
            SELECT schema_name FROM information_schema.schemata
            WHERE schema_name = 'cashback';
        """)
        if cur.fetchone():
            print("Dropping existing cashback schema...")
            cur.execute("DROP SCHEMA cashback CASCADE;")
            print("✓ Existing schema dropped")

        # Create cashback schema
        print("Creating cashback schema...")
        cur.execute("""
            CREATE SCHEMA cashback;
        """)
        print("✓ Cashback schema created successfully")

        # Create banks metadata table
        print("Creating banks metadata table...")
        cur.execute("""
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
        """)
        print("✓ Banks metadata table created")

        # Create categories table
        print("Creating categories table...")
        cur.execute("""
            CREATE TABLE cashback.categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                slug VARCHAR(100) NOT NULL UNIQUE,
                icon VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("✓ Categories table created")

        # Create a dedicated table for each bank
        for table_name, display_name, website_url in banks:
            print(f"Creating table for {display_name}...")
            cur.execute(f"""
                CREATE TABLE cashback.{table_name} (
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
            """)

            # Create indexes for each bank table
            cur.execute(f"""
                CREATE INDEX idx_{table_name}_category_id
                ON cashback.{table_name}(category_id);

                CREATE INDEX idx_{table_name}_is_active
                ON cashback.{table_name}(is_active);

                CREATE INDEX idx_{table_name}_scraped_at
                ON cashback.{table_name}(scraped_at);

                CREATE INDEX idx_{table_name}_merchant_name
                ON cashback.{table_name}(merchant_name);
            """)
            print(f"✓ Table cashback.{table_name} created with indexes")

        # Create scraping_logs table
        print("Creating scraping_logs table...")
        cur.execute("""
            CREATE TABLE cashback.scraping_logs (
                id SERIAL PRIMARY KEY,
                bank_table_name VARCHAR(100) NOT NULL,
                status VARCHAR(50) NOT NULL,
                offers_found INTEGER DEFAULT 0,
                error_message TEXT,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
        """)
        cur.execute("""
            CREATE INDEX idx_scraping_logs_bank_table
            ON cashback.scraping_logs(bank_table_name);

            CREATE INDEX idx_scraping_logs_started_at
            ON cashback.scraping_logs(started_at);
        """)
        print("✓ Scraping logs table created")

        # Insert bank metadata
        print("Inserting bank metadata...")
        for table_name, display_name, website_url in banks:
            cur.execute("""
                INSERT INTO cashback.banks (table_name, display_name, website_url)
                VALUES (%s, %s, %s);
            """, (table_name, display_name, website_url))
        print(f"✓ Inserted {len(banks)} banks")

        # Insert common categories
        print("Inserting common categories...")
        categories_data = [
            ('Supermarkets', 'supermarkets', '🛒'),
            ('Restaurants', 'restaurants', '🍽️'),
            ('Gas Stations', 'gas-stations', '⛽'),
            ('Pharmacies', 'pharmacies', '💊'),
            ('Online Shopping', 'online-shopping', '🛍️'),
            ('Transportation', 'transportation', '🚗'),
            ('Entertainment', 'entertainment', '🎬'),
            ('Electronics', 'electronics', '📱'),
            ('Fashion', 'fashion', '👗'),
            ('Travel', 'travel', '✈️'),
            ('Cafes', 'cafes', '☕'),
            ('Health & Beauty', 'health-beauty', '💅'),
            ('Education', 'education', '📚'),
            ('Other', 'other', '📦')
        ]

        for cat_name, cat_slug, cat_icon in categories_data:
            cur.execute("""
                INSERT INTO cashback.categories (name, slug, icon)
                VALUES (%s, %s, %s);
            """, (cat_name, cat_slug, cat_icon))

        print(f"✓ Inserted {len(categories_data)} categories")

        print("\n✅ Database initialization completed successfully!")
        print("\nCreated tables:")
        for table_name, display_name, _ in banks:
            print(f"  - cashback.{table_name} ({display_name})")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    create_schema()
