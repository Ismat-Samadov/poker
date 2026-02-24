# Cashback Dashboard Project

Automated web scraping system for Azerbaijan bank cashback offers with interactive Next.js dashboard.

## Project Structure

```
cashback_dashboard/
├── .env                    # Database credentials
├── requirements.txt        # Python dependencies
├── scripts/
│   ├── init_db.py         # Database initialization
│   └── run_scrapers.py    # Main scraper runner
├── scrapers/
│   ├── base_scraper.py    # Base scraper class
│   ├── db_helper.py       # Database helper
│   └── *_scraper.py       # Individual bank scrapers
├── .github/workflows/
│   └── scrape.yml         # GitHub Actions workflow
└── dashboard/             # Next.js dashboard (to be created)
```

## Database Schema

**PostgreSQL Database:** `neondb`
**Schema:** `cashback`

### Tables

Each bank has its own table:
- `cashback.abb_bank`
- `cashback.unibank`
- `cashback.access_bank`
- `cashback.atb_bank`
- `cashback.bank_of_baku`
- `cashback.rabita_bank`
- `cashback.yelo_bank`

Metadata tables:
- `cashback.banks` - Bank metadata
- `cashback.categories` - Cashback categories
- `cashback.scraping_logs` - Scraping job logs

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
python3 scripts/init_db.py
```

### 3. Run Scrapers

```bash
# Run all scrapers
python3 scripts/run_scrapers.py

# Run individual scraper
python3 -c "from scrapers.abb_bank_scraper import ABBBankScraper; ABBBankScraper().run()"
```

## Banks Covered

1. **ABB Bank** - Package-based cashback (4 packages)
2. **Unibank** - Tiered merchant cashback (Classic/Pro/Premium)
3. **Access Bank** - Category-based 5% cashback
4. **ATB Bank** - Large merchant database (72 pages)
5. **Bank of Baku** - Multi-card type cashback (Debit/Credit/Digital)
6. **Rabita Bank** - Green/Miles packages
7. **Yelo Bank** - Tiered packages (Welcome/Standard/Bright)

## Automation

GitHub Actions runs scrapers daily at 9 AM Baku time (UTC+4).

## Dashboard

Next.js dashboard will display:
- All cashback offers from all banks
- Filter by bank, category, percentage
- Compare offers across banks
- Historical data and trends

## Development Notes

### Scraper Challenges

1. **ATB Bank** - 72 pages require pagination handling
2. **Yelo Bank** - Dynamic content loaded via JavaScript (may need Selenium)
3. **Rabita Bank** - Multiple tabs and payment methods
4. **Bank of Baku** - Table parsing with multiple card types

### Next Steps

- [ ] Implement all bank scrapers with proper HTML parsing
- [ ] Handle dynamic content and pagination
- [ ] Create Next.js dashboard
- [ ] Deploy to Vercel
- [ ] Set up GitHub Actions automation
