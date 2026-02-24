'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Bank {
  id: number;
  table_name: string;
  display_name: string;
  website_url: string;
  is_active: boolean;
}

export default function Home() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [stats, setStats] = useState({ totalOffers: 0, maxCashback: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch banks
      const banksRes = await fetch('/api/banks');
      const banksData = await banksRes.json();
      setBanks(banksData);

      // Fetch all offers for stats
      const offersRes = await fetch('/api/offers');
      const offersData = await offersRes.json();

      const maxCashback = offersData.length > 0
        ? Math.max(...offersData.map((o: any) => o.cashback_percentage || 0))
        : 0;

      setStats({
        totalOffers: offersData.length,
        maxCashback: maxCashback
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
              🏦 Azerbaijan Cashback Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare cashback offers from all major banks in one place.
              Find the best deals and maximize your savings!
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Banks</p>
                <p className="text-4xl font-bold mt-2">{banks.length}</p>
              </div>
              <div className="text-5xl opacity-20">🏦</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Offers</p>
                <p className="text-4xl font-bold mt-2">{stats.totalOffers}</p>
              </div>
              <div className="text-5xl opacity-20">💳</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Best Cashback</p>
                <p className="text-4xl font-bold mt-2">{stats.maxCashback}%</p>
              </div>
              <div className="text-5xl opacity-20">🎁</div>
            </div>
          </div>
        </div>

        {/* Banks Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 mr-3">
              Select a Bank
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {banks.map((bank) => (
              <Link
                key={bank.id}
                href={`/bank/${bank.table_name}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-blue-500 transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">🏦</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {bank.display_name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      View Offers →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-8 mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💡 How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl mb-2">🔍</div>
                <h4 className="font-semibold text-gray-900 mb-1">Browse Banks</h4>
                <p className="text-sm text-gray-600">Select any bank to see their cashback offers</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900 mb-1">Compare Offers</h4>
                <p className="text-sm text-gray-600">See percentages, terms, and descriptions</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold text-gray-900 mb-1">Save Money</h4>
                <p className="text-sm text-gray-600">Choose the best cashback deals for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            🔄 Data is automatically updated daily
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Azerbaijan Cashback Dashboard © 2024
          </p>
        </div>
      </main>
    </div>
  );
}
