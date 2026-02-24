"""
Bank of Baku cashback scraper
URL: https://www.bankofbaku.com/az/kampaniyalar/bolkartda-kesbek-boldur
"""
from .base_scraper import BaseScraper
import re


class BankOfBakuScraper(BaseScraper):
    """Scraper for Bank of Baku cashback offers"""

    def __init__(self):
        super().__init__('bank_of_baku', 'Bank of Baku')
        self.url = 'https://www.bankofbaku.com/az/kampaniyalar/bolkartda-kesbek-boldur'

    def scrape(self):
        """Scrape Bank of Baku cashback offers"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # Find the main table
        table = soup.find('table')
        if not table:
            print("⚠️  Could not find cashback table")
            return []

        rows = table.find_all('tr')[1:]  # Skip header row

        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 6:
                continue

            merchant = cols[0].get_text(strip=True)
            debit_pct = self._extract_percentage(cols[1].get_text(strip=True))
            credit_pct = self._extract_percentage(cols[2].get_text(strip=True))
            max_limit = self._extract_amount(cols[3].get_text(strip=True))
            digital_pct = self._extract_percentage(cols[4].get_text(strip=True))
            digital_limit = self._extract_amount(cols[5].get_text(strip=True))

            # Create offers for each card type
            if debit_pct:
                offers.append({
                    'merchant_name': f"{merchant} (Debit Card)",
                    'cashback_percentage': debit_pct,
                    'description': f'Maximum cashback: {max_limit} AZN' if max_limit else '',
                    'source_url': self.url
                })

            if credit_pct:
                offers.append({
                    'merchant_name': f"{merchant} (Credit Card)",
                    'cashback_percentage': credit_pct,
                    'description': f'Maximum cashback: {max_limit} AZN' if max_limit else '',
                    'source_url': self.url
                })

            if digital_pct:
                offers.append({
                    'merchant_name': f"{merchant} (Digital Card)",
                    'cashback_percentage': digital_pct,
                    'description': f'Maximum cashback: {digital_limit} AZN' if digital_limit else '',
                    'source_url': self.url
                })

        print(f"✓ Scraped {len(offers)} offers from {len(rows)} merchants")
        return offers

    def _extract_percentage(self, text):
        """Extract percentage from text like '1.5%' or '3 %'"""
        if not text or text == '—' or text == '-':
            return None
        match = re.search(r'(\d+\.?\d*)\s*%', text)
        return float(match.group(1)) if match else None

    def _extract_amount(self, text):
        """Extract amount from text like '10 AZN'"""
        if not text or text == '—' or text == '-':
            return None
        match = re.search(r'(\d+)', text)
        return float(match.group(1)) if match else None
