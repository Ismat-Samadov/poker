#!/usr/bin/env python3
"""
Test script to fetch and inspect bank pages
"""
import requests
from bs4 import BeautifulSoup

def test_fetch(url, bank_name):
    """Test fetching a bank page"""
    print(f"\n{'='*60}")
    print(f"Testing {bank_name}")
    print(f"URL: {url}")
    print(f"{'='*60}")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Content Length: {len(response.content)} bytes")

        soup = BeautifulSoup(response.content, 'lxml')

        # Check for common dynamic loading indicators
        if 'window.__INITIAL_STATE__' in response.text:
            print("⚠️  Page uses client-side rendering (React/Vue)")
        if 'ng-app' in response.text or 'ng-controller' in response.text:
            print("⚠️  Page uses AngularJS")
        if 'swiper' in response.text.lower():
            print("⚠️  Page uses Swiper.js carousel")

        # Try to find content indicators
        tables = soup.find_all('table')
        if tables:
            print(f"✓ Found {len(tables)} table(s)")

        divs = soup.find_all('div', class_=lambda x: x and ('card' in x or 'item' in x or 'offer' in x))
        if divs:
            print(f"✓ Found {len(divs)} potential offer containers")

        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    banks = [
        ('https://abb-bank.az/ferdi/kesbek/faydali-kesbek', 'ABB Bank'),
        ('https://unibank.az/az/cards/cashback', 'Unibank'),
        ('https://www.accessbank.az/az/private/cards/mycard/white/', 'Access Bank'),
        ('https://atb.az/brands/', 'ATB Bank'),
        ('https://www.bankofbaku.com/az/kampaniyalar/bolkartda-kesbek-boldur', 'Bank of Baku'),
        ('https://www.rabitabank.com/ferdi/kesbek-1', 'Rabita Bank'),
        ('https://www.yelo.az/az/individuals/cashback/', 'Yelo Bank')
    ]

    for url, name in banks:
        test_fetch(url, name)
