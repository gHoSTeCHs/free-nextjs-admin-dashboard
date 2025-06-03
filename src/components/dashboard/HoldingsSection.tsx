import React from 'react';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change: number;
  logo: string;
}

interface HoldingsSectionProps {
  holdings: Holding[];
}

const HoldingsSection: React.FC<HoldingsSectionProps> = ({ holdings }) => {
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
  );
};

export default HoldingsSection;