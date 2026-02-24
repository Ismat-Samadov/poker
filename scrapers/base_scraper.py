"""
Base scraper class for all bank scrapers
"""
from abc import ABC, abstractmethod
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from .db_helper import DatabaseHelper


class BaseScraper(ABC):
    """Abstract base class for bank cashback scrapers"""

    def __init__(self, bank_table_name, bank_display_name):
        """
        Initialize the scraper

        Args:
            bank_table_name: Database table name (e.g., 'abb_bank')
            bank_display_name: Display name for logs (e.g., 'ABB Bank')
        """
        self.bank_table_name = bank_table_name
        self.bank_display_name = bank_display_name
        self.db = DatabaseHelper(bank_table_name)

        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }

    @abstractmethod
    def scrape(self):
        """
        Main scraping method to be implemented by each bank scraper
        Should return a list of offer dictionaries
        """
        pass

    def fetch_page(self, url):
        """Fetch a webpage and return BeautifulSoup object"""
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def normalize_offer(self, offer):
        """Normalize offer data with default values"""
        return {
            'category_id': offer.get('category_id'),
            'merchant_name': offer.get('merchant_name', 'Unknown'),
            'cashback_percentage': offer.get('cashback_percentage'),
            'cashback_amount': offer.get('cashback_amount'),
            'description': offer.get('description', ''),
            'terms': offer.get('terms', ''),
            'start_date': offer.get('start_date'),
            'end_date': offer.get('end_date'),
            'is_active': True,
            'source_url': offer.get('source_url', ''),
            'scraped_at': datetime.now()
        }

    def run(self):
        """Run the scraper with logging"""
        log_id = self.db.start_scraping_log()
        print(f"\n{'='*60}")
        print(f"Starting scraper for {self.bank_display_name}")
        print(f"Table: cashback.{self.bank_table_name}")
        print(f"{'='*60}")

        try:
            # Delete old data before inserting new
            deleted = self.db.delete_old_offers()
            if deleted > 0:
                print(f"  Deleted {deleted} old offers")

            # Scrape offers
            offers = self.scrape()

            if not offers:
                print(f"⚠️  No offers found for {self.bank_display_name}")
                self.db.complete_scraping_log(log_id, 'completed', 0)
                return

            # Normalize and insert offers
            normalized_offers = [self.normalize_offer(offer) for offer in offers]
            count = self.db.bulk_insert_offers(normalized_offers)

            print(f"✓ Successfully scraped {count} offers from {self.bank_display_name}")
            self.db.complete_scraping_log(log_id, 'completed', count)

        except Exception as e:
            error_msg = f"Error scraping {self.bank_display_name}: {str(e)}"
            print(f"❌ {error_msg}")
            self.db.complete_scraping_log(log_id, 'failed', 0, error_msg)
            raise
