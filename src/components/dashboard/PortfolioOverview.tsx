'use client'

import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Activity, Eye, EyeOff } from 'lucide-react';

interface PortfolioData {
  totalBalance: number;
  totalChange: number;
  totalChangeAmount: number;
}

interface PortfolioOverviewProps {
  portfolioData: PortfolioData;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolioData }) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Overview</h2>
            <p className="text-gray-500 dark:text-gray-400">Track your crypto investments</p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8" />
              <div className="text-right">
                <p className="text-sm opacity-80">Total Balance</p>
                <p className="text-2xl font-bold">
                  {showBalance ? formatCurrency(portfolioData.totalBalance) : '••••••'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {portfolioData.totalChange > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm">
                {formatPercentage(portfolioData.totalChange)} ({formatCurrency(portfolioData.totalChangeAmount)})
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">24h Profit/Loss</p>
                <p className="text-xl font-bold text-green-500">+{formatCurrency(8420.15)}</p>
              </div>
            </div>
            <div className="text-sm text-green-500">+5.8% from yesterday</div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-500" />
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Positions</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Across 8 exchanges</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;