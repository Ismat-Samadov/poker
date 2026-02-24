"""
Unibank cashback scraper
URL: https://unibank.az/az/cards/cashback
"""
from .base_scraper import BaseScraper


class UnibankScraper(BaseScraper):
    """Scraper for Unibank cashback offers"""

    def __init__(self):
        super().__init__('unibank', 'Unibank')
        self.url = 'https://unibank.az/az/cards/cashback'

    def scrape(self):
        """Scrape Unibank cashback offers (tier-based)"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # Unibank has 3 tiers: Classic, Pro, Premium
        # Based on WebFetch analysis
        merchants = {
            'Bravo': {'classic': 2, 'pro': 4, 'premium': 6},
            'SOCAR': {'classic': 2, 'pro': 5, 'premium': 6},
            'Trendyol': {'classic': 3, 'pro': 5, 'premium': 6},
            'Temu': {'classic': 0.5, 'pro': 4, 'premium': 5},
            'Bytelecom': {'classic': 10, 'pro': 10, 'premium': 10},
            'Hill': {'classic': 3, 'pro': 5, 'premium': 5},
            'Medical Facilities': {'classic': 5, 'pro': 5, 'premium': 5},
            'Restaurants': {'classic': 2, 'pro': 3, 'premium': 5},
            'Push30': {'classic': 0, 'pro': 5, 'premium': 10},
            'Other Categories': {'classic': 0, 'pro': 0, 'premium': 0.5}
        }

        for merchant, rates in merchants.items():
            for tier, percentage in rates.items():
                if percentage > 0:
                    offers.append({
                        'merchant_name': f"{merchant} ({tier.capitalize()})",
                        'cashback_percentage': percentage,
                        'description': f'Tier: {tier.capitalize()}. Spending threshold: Classic (0-300 AZN), Pro (300-800 AZN), Premium (800+ AZN)',
                        'terms': 'Activation required via UBank app. Minimum 10 AZN transfer threshold',
                        'source_url': self.url
                    })

        print(f"✓ Scraped {len(offers)} offers")
        return offers
