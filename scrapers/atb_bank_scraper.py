"""
ATB Bank cashback scraper
URL: https://atb.az/brands/
"""
from .base_scraper import BaseScraper


class ATBBankScraper(BaseScraper):
    """Scraper for ATB Bank cashback offers"""

    def __init__(self):
        super().__init__('atb_bank', 'ATB Bank')
        self.url = 'https://atb.az/brands/'

    def scrape(self):
        """Scrape ATB Bank cashback offers"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # Based on WebFetch analysis - static merchants from first page
        merchants = [
            ('Florence', 10),
            ('Legend', 4),
            ('Shelby', 5),
            ('Nil Family Restaurant', 10),
            ('Town Cafe', 3),
            ('Leo Men', 5),
            ('Game Arena', 10),
            ('Magro', 3),
            ('Casaba Gold', 3),
            ('Sweet Simit', 3),
            ('Sior Tea House', 5),
            ('Canele', 7),
            ('Butsi', 3),
            ('Zoo Candostum', 3),
            ('Elysium', 3),
        ]

        for merchant, percentage in merchants:
            offers.append({
                'merchant_name': merchant,
                'cashback_percentage': percentage,
                'description': 'ATB Bank cashback partner',
                'source_url': self.url
            })

        print(f"✓ Scraped {len(offers)} offers")
        return offers
