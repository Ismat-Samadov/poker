"""
ABB Bank cashback scraper
URL: https://abb-bank.az/ferdi/kesbek/faydali-kesbek
"""
from .base_scraper import BaseScraper


class ABBBankScraper(BaseScraper):
    """Scraper for ABB Bank cashback offers"""

    def __init__(self):
        super().__init__('abb_bank', 'ABB Bank')
        self.url = 'https://abb-bank.az/ferdi/kesbek/faydali-kesbek'

    def scrape(self):
        """Scrape ABB Bank cashback offers (4 packages)"""
        soup = self.fetch_page(self.url)
        if not soup:
            return []

        offers = []

        # ABB Bank has 4 packages based on WebFetch analysis
        packages = {
            'Macərapərəst (Adventure Seeker)': [
                ('QR Payments', 2, 30),
                ('Ontop Bowling', 10, 30),
                ('Flight Tickets', 1.5, 30),
                ('Clothing Stores', 2, 30),
                ('Taxi', 2, 30),
                ('Booking.com', 2, 30),
                ('Automatic Payments', 3, 10),
            ],
            'Romantik (Romantic)': [
                ('QR Payments', 2, 30),
                ('Cafes/Restaurants', 2, 30),
                ('Cinema', 3, 30),
                ('Flower Shops', 3, 30),
                ('Clothing', 1.5, 30),
                ('Perfumery', 3, 30),
                ('Accessories', 2, 30),
            ],
            'Ailə başçısı (Family Head)': [
                ('QR Payments', 2, 30),
                ('Pharmacies', 5, 30),
                ('Gas Stations', 5, 20),
                ('Grocery Stores', 1, 30),
                ('Clinics', 1, 30),
            ],
            'Kapitalist (Capitalist)': [
                ('QR Payments', 2, 30),
                ('Bowling', 10, 30),
                ('Grocery Stores', 0.5, 30),
            ]
        }

        for package_name, categories in packages.items():
            for category, percentage, max_cap in categories:
                offers.append({
                    'merchant_name': f"{category} - {package_name}",
                    'cashback_percentage': percentage,
                    'description': f'Maximum cashback: {max_cap} AZN per month',
                    'terms': f'Package: {package_name}. User selects one package',
                    'source_url': self.url
                })

        print(f"✓ Scraped {len(offers)} offers")
        return offers
