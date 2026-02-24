# Quick Start Guide - Cashback Dashboard

## What You Have Now ✅

A fully functional cashback data scraping and dashboard system with:

1. **PostgreSQL Database** with separate tables for each of 7 banks
2. **Python Scrapers** - Base infrastructure + 1 working scraper (Bank of Baku)
3. **GitHub Actions** - Automated daily scraping at 9 AM Baku time
4. **Next.js Dashboard** - Beautiful, responsive UI to view all offers
5. **Complete Documentation** - SQL migrations, README, project status

## Project Structure

```
cashback_dashboard/
├── .env                          # Database credentials ✅
├── .gitignore                    # Git ignore rules ✅
├── requirements.txt              # Python dependencies ✅
├── README.md                     # Main documentation ✅
├── PROJECT_STATUS.md             # Detailed status report ✅
├── .github/workflows/
│   └── scrape.yml               # Daily automation ✅
├── schema/                       # SQL migrations ✅
│   ├── 001_init_schema.sql
│   ├── 002_seed_data.sql
│   └── README.md
├── docs/
│   └── BANK_ANALYSIS.md         # Bank website analysis ✅
├── scripts/
│   ├── init_db.py               # DB initialization ✅
│   ├── run_scrapers.py          # Main runner ✅
│   └── test_fetch.py            # Testing tool ✅
├── scrapers/
│   ├── __init__.py
│   ├── base_scraper.py          # Base class ✅
│   ├── db_helper.py             # DB operations ✅
│   ├── bank_of_baku_scraper.py  # Working scraper ✅
│   ├── abb_bank_scraper.py      # Template 🔨
│   ├── unibank_scraper.py       # Template 🔨
│   ├── access_bank_scraper.py   # Template 🔨
│   ├── atb_bank_scraper.py      # Template 🔨
│   ├── rabita_bank_scraper.py   # Template 🔨
│   └── yelo_bank_scraper.py     # Template 🔨
└── dashboard/                    # Next.js app ✅
    ├── app/
    │   ├── page.tsx             # Main dashboard UI
    │   └── api/
    │       ├── banks/route.ts
    │       └── offers/route.ts
    ├── lib/db.ts                # Database connection
    └── .env.local               # Dashboard env vars
```

Legend: ✅ Complete | 🔨 Needs Implementation

## Test What You Have

### 1. Test Database Connection

```bash
python3 -c "
import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
print('✅ Database connected successfully!')
conn.close()
"
```

### 2. Test Bank of Baku Scraper

```bash
python3 -c "from scrapers.bank_of_baku_scraper import BankOfBakuScraper; BankOfBakuScraper().run()"
```

Expected output:
```
============================================================
Starting scraper for Bank of Baku
Table: cashback.bank_of_baku
============================================================
✓ Scraped 20 offers from 11 merchants
✓ Successfully scraped 20 offers from Bank of Baku
```

### 3. View Data in Database

```bash
python3 -c "
import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()
cur.execute('SELECT COUNT(*) FROM cashback.bank_of_baku WHERE is_active = true')
print(f'Active offers: {cur.fetchone()[0]}')
cur.execute('SELECT merchant_name, cashback_percentage FROM cashback.bank_of_baku LIMIT 5')
for row in cur.fetchall():
    print(f'  - {row[0]}: {row[1]}%')
conn.close()
"
```

### 4. Run Dashboard

```bash
cd dashboard
npm install   # First time only
npm run dev
```

Open http://localhost:3000 - you should see:
- 7 banks listed
- 20 offers from Bank of Baku
- Interactive table with filtering

## Next Steps

### Immediate (Next 1-2 hours)

1. **Implement Remaining Scrapers** - Start with easier ones:
   ```bash
   # Edit these files to add scraping logic:
   scrapers/rabita_bank_scraper.py     # Has tables - easier
   scrapers/access_bank_scraper.py     # Simple structure
   scrapers/unibank_scraper.py         # Static content
   ```

2. **Test Each Scraper**:
   ```bash
   python3 -c "from scrapers.rabita_bank_scraper import RabitaBankScraper; RabitaBankScraper().run()"
   ```

3. **Run All Scrapers**:
   ```bash
   python3 scripts/run_scrapers.py
   ```

### Short Term (This Week)

1. **Deploy Dashboard to Vercel**:
   ```bash
   cd dashboard
   npm install -g vercel
   vercel login
   vercel --prod
   ```

   Add environment variable in Vercel dashboard:
   - `DATABASE_URL` = your connection string

2. **Set Up GitHub Actions**:
   - Push code to GitHub
   - Add `DATABASE_URL` to GitHub Secrets
   - Actions will run automatically daily

3. **Enhance Dashboard**:
   - Add more filters (category, percentage range)
   - Add comparison view
   - Add charts

### Medium Term (Next Week)

1. **Handle Complex Scrapers**:
   - ATB Bank (72 pages - add pagination logic)
   - Yelo Bank (may need Selenium for dynamic content)

2. **Add Features**:
   - Email notifications for new offers
   - Historical data tracking
   - Price alerts

3. **Monitoring**:
   - Set up error notifications
   - Add scraping success metrics
   - Create admin dashboard

## Common Commands

```bash
# Database
python3 scripts/init_db.py              # Reset database
psql $DATABASE_URL -f schema/001_init_schema.sql  # Apply migration

# Scrapers
python3 scripts/run_scrapers.py         # Run all
python3 scripts/test_fetch.py           # Test page fetching

# Dashboard
cd dashboard && npm run dev             # Run locally
cd dashboard && npm run build           # Build for production
cd dashboard && vercel --prod           # Deploy

# Check data
python3 -c "import psycopg2, os; from dotenv import load_dotenv; load_dotenv(); conn = psycopg2.connect(os.getenv('DATABASE_URL')); cur = conn.cursor(); cur.execute('SELECT table_name, COUNT(*) FROM cashback.bank_of_baku'); print(cur.fetchall()); conn.close()"
```

## Troubleshooting

### "No module named 'psycopg2'"
```bash
pip install psycopg2-binary python-dotenv requests beautifulsoup4 lxml
```

### "DATABASE_URL not found"
Make sure `.env` file exists in root with:
```
DATABASE_URL=
```

### Dashboard won't start
```bash
cd dashboard
rm -rf .next node_modules
npm install
npm run dev
```

### Scraper returns 0 offers
- Check website URL is still valid
- Check HTML structure hasn't changed
- Use `scripts/test_fetch.py` to inspect page

## Resources

- **Main Docs**: `README.md`
- **Project Status**: `PROJECT_STATUS.md`
- **Bank Analysis**: `docs/BANK_ANALYSIS.md`
- **Schema Docs**: `schema/README.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## Getting Help

1. Check error messages in terminal
2. Review relevant documentation files
3. Test individual components (database, scrapers, dashboard)
4. Check GitHub Actions logs if automation fails

---

**You're 60% Done!**

✅ Foundation complete
✅ Database working
✅ 1 scraper working
✅ Dashboard working
🔨 6 scrapers to implement
🔨 Deploy to production

Good luck! 🚀
