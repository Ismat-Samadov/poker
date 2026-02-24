'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Offer {
  id: number;
  merchant_name: string;
  cashback_percentage: number;
  cashback_amount: number;
  description: string;
  terms: string;
  source_url: string;
  scraped_at: string;
}

interface Bank {
  id: number;
  table_name: string;
  display_name: string;
  website_url: string;
}

export default function BankPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [bank, setBank] = useState<Bank | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankData();
  }, [slug]);

  const fetchBankData = async () => {
    try {
      // Fetch bank info
      const banksRes = await fetch('/api/banks');
      const banks = await banksRes.json();
      const foundBank = banks.find((b: Bank) => b.table_name === slug);

      if (foundBank) {
        setBank(foundBank);

        // Fetch offers
        const offersRes = await fetch(`/api/offers?bank=${slug}`);
        const offersData = await offersRes.json();
        setOffers(offersData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Bank not found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const maxCashback = offers.length > 0 ? Math.max(...offers.map(o => o.cashback_percentage || 0)) : 0;
  const avgCashback = offers.length > 0
    ? (offers.reduce((sum, o) => sum + (o.cashback_percentage || 0), 0) / offers.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Back to all banks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{bank.display_name}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {offers.length} active cashback offers
          </p>
          <a
            href={bank.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Visit official website →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Offers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{offers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Max Cashback</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{maxCashback}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Cashback</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{avgCashback}%</p>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Cashback Offers
            </h3>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No offers available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merchant / Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cashback
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terms
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {offer.merchant_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {offer.cashback_percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {offer.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {offer.terms || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {offers.length > 0 ? new Date(offers[0].scraped_at).toLocaleString() : 'N/A'}</p>
        </div>
      </main>
    </div>
  );
}
