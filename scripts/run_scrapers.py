#!/usr/bin/env python3
"""
Main script to run all bank scrapers
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scrapers.abb_bank_scraper import ABBBankScraper
from scrapers.unibank_scraper import UnibankScraper
from scrapers.access_bank_scraper import AccessBankScraper
from scrapers.atb_bank_scraper import ATBBankScraper
from scrapers.bank_of_baku_scraper import BankOfBakuScraper
from scrapers.rabita_bank_scraper import RabitaBankScraper
from scrapers.yelo_bank_scraper import YeloBankScraper


def main():
    """Run all bank scrapers"""
    scrapers = [
        ABBBankScraper(),
        UnibankScraper(),
        AccessBankScraper(),
        ATBBankScraper(),
        BankOfBakuScraper(),
        RabitaBankScraper(),
        YeloBankScraper()
    ]

    print("="*60)
    print("CASHBACK SCRAPING JOB STARTED")
    print("="*60)

    total_success = 0
    total_failed = 0

    for scraper in scrapers:
        try:
            scraper.run()
            total_success += 1
        except Exception as e:
            print(f"Failed to run {scraper.bank_display_name}: {e}")
            total_failed += 1

    print("\n" + "="*60)
    print("SCRAPING JOB COMPLETED")
    print(f"Success: {total_success} | Failed: {total_failed}")
    print("="*60)


if __name__ == "__main__":
    main()
