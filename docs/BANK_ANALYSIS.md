# Bank Cashback Data Analysis

## 1. ABB Bank
**URL:** https://abb-bank.az/ferdi/kesbek/faydali-kesbek
**Structure:** Package-based with 4 options
**Packages:**
- Macərapərəst (Adventure Seeker)
- Romantik (Romantic)
- Ailə başçısı (Family Head)
- Kapitalist (Capitalist)

**Data Format:** Each package has categories with percentage + max cap (e.g., "2% max 30₼")

## 2. Unibank
**URL:** https://unibank.az/az/cards/cashback
**Structure:** Tier-based (Classic, Pro, Premium)
**Merchants:** Bravo, SOCAR, Trendyol, Temu, Bytelecom, Hill, Medical, Restaurants, Push30
**Data Format:** Matrix of merchant × tier with different percentages

## 3. Access Bank (myCard White)
**URL:** https://www.accessbank.az/az/private/cards/mycard/white/
**Structure:** Simple 5% across 11 categories
**Categories:** Marketplaces, Cafes/Restaurants, Clothing, Cinemas, Pharmacies, Flowers, Pets, Beauty/Spa, Sports, Entertainment
**Terms:** User selects 3 categories monthly, 100 AZN total cap

## 4. ATB Bank
**URL:** https://atb.az/brands/
**Structure:** Large merchant database with **72 pages**
**Data Format:** Individual merchants with specific percentages
**Pagination:** Requires scraping all 72 pages
**Categories:** 17 different categories in sidebar

## 5. Bank of Baku (Bolkart)
**URL:** https://www.bankofbaku.com/az/kampaniyalar/bolkartda-kesbek-boldur
**Structure:** Table format with multiple card types
**Card Types:** Debit, Credit, Digital
**Data Format:** Each merchant has different rates per card type
**Merchants:** Azpetrol, SOCAR, Bravo, Trendyol/Temu, Restaurants, Clothing, Electronics, All Purchases

## 6. Rabita Bank
**URL:** https://www.rabitabank.com/ferdi/kesbek-1
**Structure:** Two packages (Green and Miles)
**Special:** Different rates for card vs Apple Pay/Google Pay
**Data Format:** Category-based with payment method variations
**Categories:** Cinemas, Fuel, Restaurants, Taxis, etc.

## 7. Yelo Bank
**URL:** https://www.yelo.az/az/individuals/cashback/
**Structure:** Three tiered packages (Welcome, Standard, Bright)
**Dynamic:** Uses Swiper.js carousel and load more button
**Data Format:** Category-based with increasing percentages by tier
**Sample:** Restaurants (1.5%/2%/3%), Cinema (10%/15%/20%)
