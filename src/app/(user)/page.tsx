import HoldingsSection from '@/components/dashboard/HoldingsSection';
import MarketOverview from '@/components/dashboard/MarketOverview';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	title: 'NodeRevert - Blockchain Asset Recovery Specialists',
	description:
		'Triple encrypted crypto recovery vault for secure digital asset restoration and blockchain investigation services.',
};

const CryptoDashboard = () => {
	const portfolioData = {
		totalBalance: 847291.42,
		totalChange: 12.4,
		totalChangeAmount: 10485.21,
	};

	const holdings = [
		{
			symbol: 'BTC',
			name: 'Bitcoin',
			amount: 2.5,
			value: 125000,
			change: 5.2,
			logo: '₿',
		},
		{
			symbol: 'ETH',
			name: 'Ethereum',
			amount: 15.8,
			value: 42000,
			change: -2.1,
			logo: 'Ξ',
		},
		{
			symbol: 'SOL',
			name: 'Solana',
			amount: 450,
			value: 18000,
			change: 8.7,
			logo: '◎',
		},
		{
			symbol: 'ADA',
			name: 'Cardano',
			amount: 12000,
			value: 4800,
			change: 3.4,
			logo: '₳',
		},
		{
			symbol: 'DOT',
			name: 'Polkadot',
			amount: 800,
			value: 3200,
			change: -1.8,
			logo: '●',
		},
	];

	const marketData = [
		{
			symbol: 'BTC',
			name: 'Bitcoin',
			price: 50000,
			change: 5.2,
			volume: '28.5B',
			marketCap: '980B',
		},
		{
			symbol: 'ETH',
			name: 'Ethereum',
			price: 2650,
			change: -2.1,
			volume: '15.2B',
			marketCap: '318B',
		},
		{
			symbol: 'BNB',
			name: 'BNB',
			price: 340,
			change: 3.8,
			volume: '2.1B',
			marketCap: '52B',
		},
		{
			symbol: 'XRP',
			name: 'XRP',
			price: 0.65,
			change: 12.5,
			volume: '3.8B',
			marketCap: '37B',
		},
		{
			symbol: 'SOL',
			name: 'Solana',
			price: 40,
			change: 8.7,
			volume: '1.9B',
			marketCap: '18B',
		},
	];

	const recentTransactions = [
		{
			type: 'buy' as const,
			symbol: 'BTC',
			amount: 0.1,
			value: 5000,
			time: '2 mins ago',
			status: 'completed' as const,
		},
		{
			type: 'sell' as const,
			symbol: 'ETH',
			amount: 2.5,
			value: 6625,
			time: '1 hour ago',
			status: 'completed' as const,
		},
		{
			type: 'buy' as const,
			symbol: 'SOL',
			amount: 50,
			value: 2000,
			time: '3 hours ago',
			status: 'pending' as const,
		},
		{
			type: 'sell' as const,
			symbol: 'ADA',
			amount: 1000,
			value: 400,
			time: '1 day ago',
			status: 'completed' as const,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
			<div className="flex">
				<main className="flex-1 p-6">
					<PortfolioOverview portfolioData={portfolioData} />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<HoldingsSection holdings={holdings} />
						<MarketOverview marketData={marketData} />
					</div>

					<RecentTransactions transactions={recentTransactions} />
				</main>
			</div>

			{/* Overlay - Positioned to cover main content area only, centered on screen */}
			<div className="fixed top-0 left-0 lg:left-[90px] xl:left-[290px] right-0 bottom-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center lg:top-16">
				<div className="text-center">
					<h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
						FEATURE
					</h1>
					<h2 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-6">
						COMING SOON
					</h2>
					<div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
				</div>
			</div>
		</div>
	);
};

export default CryptoDashboard;
