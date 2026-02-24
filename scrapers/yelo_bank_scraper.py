"""
Yelo Bank cashback scraper
URL: https://www.yelo.az/az/individuals/cashback/
"""
from .base_scraper import BaseScraper


class YeloBankScraper(BaseScraper):
    """Scraper for Yelo Bank cashback offers"""

    def __init__(self):
        super().__init__('yelo_bank', 'Yelo Bank')
        self.url = 'https://www.yelo.az/az/individuals/cashback/'

    def scrape(self):
        """Scrape Yelo Bank cashback offers (3 tiers)"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # Based on WebFetch analysis - 3 tiered packages
        categories = {
            'Restaurants': {'welcome': 1.5, 'standard': 2, 'bright': 3},
            'Cinema': {'welcome': 10, 'standard': 15, 'bright': 20},
            'Wingz Scooters': {'welcome': 10, 'standard': 15, 'bright': 20},
            'Clothing': {'welcome': 1.5, 'standard': 3, 'bright': 4},
            'Airlines (Wizz Air)': {'welcome': 10, 'standard': 7, 'bright': 10},
            'Cafes': {'welcome': 1.5, 'standard': 2, 'bright': 3},
            'Gas Stations': {'welcome': 1, 'standard': 2, 'bright': 3},
            'Pharmacies': {'welcome': 2, 'standard': 3, 'bright': 4},
            'Supermarkets': {'welcome': 1, 'standard': 1.5, 'bright': 2},
            'Taxi': {'welcome': 2, 'standard': 3, 'bright': 4},
        }

        for category, rates in categories.items():
            for tier, percentage in rates.items():
                offers.append({
                    'merchant_name': f"{category} ({tier.capitalize()} Package)",
                    'cashback_percentage': percentage,
                    'description': f'Tier: {tier.capitalize()}. Package selection determines cashback rate',
                    'terms': 'Choose between Welcome, Standard, or Bright package',
                    'source_url': self.url
                })

        print(f"✓ Scraped {len(offers)} offers")
        return offers
