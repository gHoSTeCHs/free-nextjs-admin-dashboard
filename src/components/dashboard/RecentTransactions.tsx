'use client'

import React, { useState } from 'react';

interface Transaction {
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  value: number;
  time: string;
  status: 'completed' | 'pending';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '1Y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === period
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Asset</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.type === 'buy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 font-medium text-gray-900 dark:text-white">{tx.symbol}</td>
                <td className="py-4 text-gray-600 dark:text-gray-300">{tx.amount}</td>
                <td className="py-4 text-gray-900 dark:text-white">{formatCurrency(tx.value)}</td>
                <td className="py-4 text-gray-500 dark:text-gray-400">{tx.time}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;