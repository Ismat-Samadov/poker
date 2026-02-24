import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const banks = await query(`
      SELECT id, table_name, display_name, website_url, logo_url, is_active
      FROM cashback.banks
      WHERE is_active = true
      ORDER BY display_name
    `);

    return NextResponse.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}
