import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bankTable = searchParams.get('bank');

    // Get all banks
    const banks = await query(`
      SELECT table_name, display_name FROM cashback.banks WHERE is_active = true
    `);

    let allOffers: any[] = [];

    // If specific bank requested
    if (bankTable) {
      const bank = banks.find((b: any) => b.table_name === bankTable);
      if (bank) {
        const offers = await query(`
          SELECT *, '${bank.display_name}' as bank_name
          FROM cashback.${bankTable}
          WHERE is_active = true
          ORDER BY cashback_percentage DESC
          LIMIT 100
        `);
        allOffers = offers;
      }
    } else {
      // Get offers from all banks
      for (const bank of banks) {
        try {
          const offers = await query(`
            SELECT *, '${bank.display_name}' as bank_name
            FROM cashback.${bank.table_name}
            WHERE is_active = true
            ORDER BY cashback_percentage DESC
            LIMIT 50
          `);
          allOffers = allOffers.concat(offers);
        } catch (err) {
          console.error(`Error fetching from ${bank.table_name}:`, err);
        }
      }
    }

    // Sort by percentage descending
    allOffers.sort((a, b) => (b.cashback_percentage || 0) - (a.cashback_percentage || 0));

    return NextResponse.json(allOffers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
