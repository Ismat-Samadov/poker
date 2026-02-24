-- Seed data for cashback dashboard
-- Version: 002
-- Date: 2024-02-24
-- Description: Inserts initial banks and categories

-- =============================================================================
-- INSERT BANKS
-- =============================================================================

INSERT INTO cashback.banks (table_name, display_name, website_url) VALUES
    ('abb_bank', 'ABB Bank', 'https://abb-bank.az/ferdi/kesbek/faydali-kesbek'),
    ('unibank', 'Unibank', 'https://unibank.az/az/cards/cashback'),
    ('access_bank', 'Access Bank', 'https://www.accessbank.az/az/private/cards/mycard/white/'),
    ('atb_bank', 'ATB Bank', 'https://atb.az/brands/'),
    ('bank_of_baku', 'Bank of Baku', 'https://www.bankofbaku.com/az/kampaniyalar/bolkartda-kesbek-boldur'),
    ('rabita_bank', 'Rabita Bank', 'https://www.rabitabank.com/ferdi/kesbek-1'),
    ('yelo_bank', 'Yelo Bank', 'https://www.yelo.az/az/individuals/cashback/')
ON CONFLICT (table_name) DO UPDATE SET
    website_url = EXCLUDED.website_url,
    updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- INSERT CATEGORIES
-- =============================================================================

INSERT INTO cashback.categories (name, slug, icon) VALUES
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
ON CONFLICT (name) DO NOTHING;
