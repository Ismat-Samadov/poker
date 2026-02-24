# Azerbaijan Cashback Dashboard

Web scraping system + dashboard for tracking cashback offers from 7 Azerbaijan banks.

## Setup

1. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure database**:
Create `.env` file with your database URL:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

3. **Initialize database**:
```bash
python3 scripts/init_db.py
```

4. **Run scrapers**:
```bash
python3 scripts/run_scrapers.py
```

5. **Setup dashboard**:
```bash
cd dashboard
npm install
cp ../.env .env.local
npm run dev
```

## Banks Covered

- ABB Bank
- Unibank
- Access Bank
- ATB Bank
- Bank of Baku
- Rabita Bank
- Yelo Bank

## Deploy

**Dashboard to Vercel**:
```bash
cd dashboard
vercel --prod
```

Add `DATABASE_URL` environment variable in Vercel settings.

**GitHub Actions**: Add `DATABASE_URL` to repository secrets.
