'use client'

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Activity,  Plus, Filter, MoreHorizontal, Star, Eye, EyeOff } from 'lucide-react';

const CryptoDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [showBalance, setShowBalance] = useState(true);
  
  const portfolioData = {
    totalBalance: 847291.42,
    totalChange: 12.4,
    totalChangeAmount: 10485.21
  };

  const holdings = [
    { symbol: 'BTC', name: 'Bitcoin', amount: 2.5, value: 125000, change: 5.2, logo: '₿' },
    { symbol: 'ETH', name: 'Ethereum', amount: 15.8, value: 42000, change: -2.1, logo: 'Ξ' },
    { symbol: 'SOL', name: 'Solana', amount: 450, value: 18000, change: 8.7, logo: '◎' },
    { symbol: 'ADA', name: 'Cardano', amount: 12000, value: 4800, change: 3.4, logo: '₳' },
    { symbol: 'DOT', name: 'Polkadot', amount: 800, value: 3200, change: -1.8, logo: '●' }
  ];

  const marketData = [
    { symbol: 'BTC', name: 'Bitcoin', price: 50000, change: 5.2, volume: '28.5B', marketCap: '980B' },
    { symbol: 'ETH', name: 'Ethereum', price: 2650, change: -2.1, volume: '15.2B', marketCap: '318B' },
    { symbol: 'BNB', name: 'BNB', price: 340, change: 3.8, volume: '2.1B', marketCap: '52B' },
    { symbol: 'XRP', name: 'XRP', price: 0.65, change: 12.5, volume: '3.8B', marketCap: '37B' },
    { symbol: 'SOL', name: 'Solana', price: 40, change: 8.7, volume: '1.9B', marketCap: '18B' }
  ];

  const recentTransactions = [
    { type: 'buy', symbol: 'BTC', amount: 0.1, value: 5000, time: '2 mins ago', status: 'completed' },
    { type: 'sell', symbol: 'ETH', amount: 2.5, value: 6625, time: '1 hour ago', status: 'completed' },
    { type: 'buy', symbol: 'SOL', amount: 50, value: 2000, time: '3 hours ago', status: 'pending' },
    { type: 'sell', symbol: 'ADA', amount: 1000, value: 400, time: '1 day ago', status: 'completed' }
  ];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Portfolio Overview */}
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

          {/* Holdings and Market Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Holdings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Holdings</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Asset</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">{holding.logo}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{holding.symbol}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{holding.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(holding.value)}</p>
                      <div className={`flex items-center space-x-1 text-sm ${
                        holding.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {holding.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{formatPercentage(holding.change)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Overview</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"  title='button'>
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"  title='button'>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {marketData.map((coin) => (
                  <div key={coin.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{coin.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{coin.symbol}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{coin.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(coin.price)}</p>
                      <div className={`text-sm ${coin.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(coin.change)}
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"  title='button'>
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
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
                  {recentTransactions.map((tx, index) => (
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
        </main>
      </div>
    </div>
  );
};

export default CryptoDashboard;