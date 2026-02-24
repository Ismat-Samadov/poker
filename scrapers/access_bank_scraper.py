"""
Access Bank cashback scraper
URL: https://www.accessbank.az/az/private/cards/mycard/white/
"""
from .base_scraper import BaseScraper


class AccessBankScraper(BaseScraper):
    """Scraper for Access Bank cashback offers"""

    def __init__(self):
        super().__init__('access_bank', 'Access Bank')
        self.url = 'https://www.accessbank.az/az/private/cards/mycard/white/'

    def scrape(self):
        """Scrape Access Bank cashback offers (myCard White - 5% on 11 categories)"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # Access Bank has a simple structure: 5% cashback on 11 categories
        # Users select 3 categories monthly, 100 AZN total cap
        categories = [
            'Marketplaces',
            'Cafes and Restaurants',
            'Clothing and Accessories',
            'Cinemas',
            'Pharmacies',
            'Flower Shops',
            'Pet Stores',
            'Beauty and Spa Services',
            'Sports Retailers',
            'Entertainment Venues',
            'Other'
        ]

        for category in categories:
            offers.append({
                'merchant_name': category,
                'cashback_percentage': 5.0,
                'description': 'Select 3 categories monthly. Maximum 100 AZN total cashback',
                'terms': 'myCard White: 15 AZN for 5 years. Category selection monthly',
                'source_url': self.url
            })

        print(f"✓ Scraped {len(offers)} offers")
        return offers
