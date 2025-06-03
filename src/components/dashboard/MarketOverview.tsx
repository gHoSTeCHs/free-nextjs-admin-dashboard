import React from 'react';
import { Filter, MoreHorizontal, Star } from 'lucide-react';

interface MarketCoin {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}

interface MarketOverviewProps {
  marketData: MarketCoin[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Overview</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" title="Filter">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" title="More options">
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
            <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors" title="Add to favorites">
              <Star className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;