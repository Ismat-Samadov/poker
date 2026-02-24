'use client';

import { useEffect, useState } from 'react';

interface Bank {
  id: number;
  table_name: string;
  display_name: string;
  website_url: string;
  is_active: boolean;
}

interface Offer {
  id: number;
  bank_name: string;
  merchant_name: string;
  cashback_percentage: number;
  cashback_amount: number;
  description: string;
  terms: string;
  source_url: string;
  scraped_at: string;
}

export default function Home() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanks();
    fetchOffers();
  }, []);

  useEffect(() => {
    if (selectedBank) {
      fetchOffers(selectedBank);
    } else {
      fetchOffers();
    }
  }, [selectedBank]);

  const fetchBanks = async () => {
    try {
      const res = await fetch('/api/banks');
      const data = await res.json();
      setBanks(data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const fetchOffers = async (bank?: string) => {
    setLoading(true);
    try {
      const url = bank ? `/api/offers?bank=${bank}` : '/api/offers';
      const res = await fetch(url);
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Azerbaijan Bank Cashback Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Compare cashback offers from all major banks in one place
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bank Filter */}
        <div className="mb-6">
          <label htmlFor="bank-select" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Bank
          </label>
          <select
            id="bank-select"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Banks</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.table_name}>
                {bank.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Banks</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{banks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Offers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{offers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Best Cashback</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {offers.length > 0 ? `${offers[0].cashback_percentage}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Cashback Offers
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-sm text-gray-600">Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No offers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cashback
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.bank_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {offer.merchant_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {offer.cashback_percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {offer.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(offer.scraped_at).toLocaleDateString()}
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
          <p>Data is automatically updated daily via GitHub Actions</p>
          <p className="mt-1">Last updated: {offers.length > 0 ? new Date(offers[0].scraped_at).toLocaleString() : 'N/A'}</p>
        </div>
      </main>
    </div>
  );
}
