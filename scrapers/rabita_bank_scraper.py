"""
Rabita Bank cashback scraper
URL: https://www.rabitabank.com/ferdi/kesbek-1
"""
from .base_scraper import BaseScraper
import re


class RabitaBankScraper(BaseScraper):
    """Scraper for Rabita Bank cashback offers"""

    def __init__(self):
        super().__init__('rabita_bank', 'Rabita Bank')
        self.url = 'https://www.rabitabank.com/ferdi/kesbek-1'

    def scrape(self):
        """Scrape Rabita Bank cashback offers"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # Find all tables
        tables = soup.find_all('table')

        for table in tables:
            rows = table.find_all('tr')[1:]  # Skip header

            for row in rows:
                cols = row.find_all('td')
                if len(cols) < 2:
                    continue

                # Extract category/merchant name
                category_cell = cols[0]
                merchant = category_cell.get_text(strip=True)

                if not merchant or merchant in ['Kateqoriya', 'Category', '']:
                    continue

                # Extract percentage from second column
                percentage_text = cols[1].get_text(strip=True)
                percentage = self._extract_percentage(percentage_text)

                if percentage:
                    # Check if there's a third column for payment method details
                    payment_method = ''
                    if len(cols) > 2:
                        payment_method = cols[2].get_text(strip=True)

                    merchant_display = merchant
                    if payment_method and 'Apple Pay' in payment_method:
                        merchant_display = f"{merchant} (Apple Pay/Google Pay)"
                    elif payment_method:
                        merchant_display = f"{merchant} (Card)"

                    offers.append({
                        'merchant_name': merchant_display,
                        'cashback_percentage': percentage,
                        'description': payment_method if payment_method else '',
                        'source_url': self.url
                    })

        print(f"✓ Scraped {len(offers)} offers")
        return offers

    def _extract_percentage(self, text):
        """Extract percentage from text"""
        if not text or text in ['—', '-', 'N/A']:
            return None

        # Match patterns like "5%", "0.5%", "1-2%"
        match = re.search(r'(\d+\.?\d*)\s*%', text)
        if match:
            return float(match.group(1))

        # Match range and take the higher value (e.g., "1-2%" -> 2)
        match = re.search(r'(\d+)-(\d+)\s*%', text)
        if match:
            return float(match.group(2))

        return None
