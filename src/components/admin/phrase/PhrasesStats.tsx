 
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import {
	Shield,
	Key,
	TrendingUp,
	Wallet,
	Calendar,
	Eye,
	EyeOff,
	BarChart3,
} from 'lucide-react';

interface PhrasesStats {
	totalPhrases: number;
	phrasesThisMonth: number;
	walletTypeDistribution: Array<{
		walletType: string;
		count: number;
	}>;
	recentPhrases: Array<{
		id: string;
		walletType: string;
		createdAt: string;
		user: {
			name: string | null;
			email: string | null;
		};
	}>;
}

interface PhrasesStatsProps {
	className?: string;
}

const PhrasesStatsComponent: React.FC<PhrasesStatsProps> = ({
	className = '',
}) => {
	const [stats, setStats] = useState<PhrasesStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [showSensitive, setShowSensitive] = useState(false);
	const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
	const [showViewModal, setShowViewModal] = useState(false);
	const [phraseDetails, setPhraseDetails] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch('/api/phrases');

			if (!response.ok) {
				throw new Error(`Failed to fetch stats: ${response.status}`);
			}

			const data = await response.json();
			setStats(data);
		} catch (error) {
			console.error('Error fetching phrases stats:', error);
			setError(
				error instanceof Error ? error.message : 'Failed to fetch stats'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleViewPhrase = async (phraseId: string) => {
		try {
			const response = await fetch(`/api/phrases/${phraseId}`);
			if (!response.ok) throw new Error('Failed to fetch phrase');

			const phrase = await response.json();
			setPhraseDetails(phrase);
			setSelectedPhrase(phraseId);
			setShowViewModal(true);
		} catch (error) {
			console.error('Error fetching phrase details:', error);
		}
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('en-US').format(num);
	};

	const getTopWalletTypes = () => {
		if (!stats?.walletTypeDistribution) return [];
		return stats.walletTypeDistribution.slice(0, 5);
	};

	const getGrowthPercentage = () => {
		if (!stats) return 0;
		const previousMonthCount = stats.totalPhrases - stats.phrasesThisMonth;
		if (previousMonthCount === 0) return 100;
		return ((stats.phrasesThisMonth / previousMonthCount) * 100).toFixed(1);
	};

	if (loading) {
		return (
			<div
				className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
				<div className="animate-pulse">
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error || !stats) {
		return (
			<div
				className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
				<div className="text-center text-red-500 dark:text-red-400">
					{error || 'Failed to load statistics'}
				</div>
				<button
					onClick={fetchStats}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto block">
					Retry
				</button>
			</div>
		);
	}

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Phrases Statistics
					</h2>
					<p className="text-gray-500 dark:text-gray-400">
						Overview of seed phrase management
					</p>
				</div>
				<button
					onClick={() => setShowSensitive(!showSensitive)}
					className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
					title={showSensitive ? 'Hide sensitive data' : 'Show sensitive data'}>
					{showSensitive ? (
						<Eye className="w-5 h-5" />
					) : (
						<EyeOff className="w-5 h-5" />
					)}
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
					<div className="flex items-center justify-between mb-4">
						<Shield className="w-8 h-8" />
						<div className="text-right">
							<p className="text-sm opacity-80">Total Phrases</p>
							<p className="text-2xl font-bold">
								{showSensitive ? formatNumber(stats.totalPhrases) : '••••'}
							</p>
						</div>
					</div>
					<div className="text-sm opacity-90">Securely stored seed phrases</div>
				</div>

				<div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
					<div className="flex items-center justify-between mb-4">
						<TrendingUp className="w-8 h-8 text-green-500" />
						<div className="text-right">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								This Month
							</p>
							<p className="text-xl font-bold text-green-500">
								{showSensitive ? formatNumber(stats.phrasesThisMonth) : '••••'}
							</p>
						</div>
					</div>
					<div className="text-sm text-green-500">
						+{getGrowthPercentage()}% growth
					</div>
				</div>

				<div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
					<div className="flex items-center justify-between mb-4">
						<Wallet className="w-8 h-8 text-blue-500" />
						<div className="text-right">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Wallet Types
							</p>
							<p className="text-xl font-bold text-gray-900 dark:text-white">
								{stats.walletTypeDistribution.length}
							</p>
						</div>
					</div>
					<div className="text-sm text-gray-500 dark:text-gray-400">
						Different wallet types supported
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
					<div className="flex items-center space-x-2 mb-4">
						<BarChart3 className="w-5 h-5 text-blue-500" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Top Wallet Types
						</h3>
					</div>
					<div className="space-y-3">
						{getTopWalletTypes().map((item, index) => (
							<div key={index} className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 rounded-full bg-blue-500" />
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										{item.walletType.replace(/_/g, ' ')}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
										<div
											className="bg-blue-500 h-2 rounded-full"
											style={{
												width: `${Math.min(
													(item.count / stats.totalPhrases) * 100,
													100
												)}%`,
											}}
										/>
									</div>
									<span className="text-sm text-gray-500 dark:text-gray-400 min-w-[2rem] text-right">
										{showSensitive ? item.count : '••'}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Recent Phrases */}
				<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
					<div className="flex items-center space-x-2 mb-4">
						<Calendar className="w-5 h-5 text-green-500" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Recent Phrases
						</h3>
					</div>
					<div className="space-y-3">
						{stats.recentPhrases.length > 0 ? (
							stats.recentPhrases.map((phrase) => (
								<div
									key={phrase.id}
									onClick={() => handleViewPhrase(phrase.id)}
									className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
									<div className="flex items-center space-x-3">
										<Key className="w-4 h-4 text-purple-500" />
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{phrase.walletType.replace(/_/g, ' ')}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{phrase.user.name ||
													phrase.user.email ||
													'Unknown User'}
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<div className="text-xs text-gray-500 dark:text-gray-400">
											{new Date(phrase.createdAt).toLocaleDateString()}
										</div>
										<Eye className="w-4 h-4 text-gray-400" />
									</div>
								</div>
							))
						) : (
							<div className="text-center text-gray-500 dark:text-gray-400 py-4">
								No recent phrases found
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Security Notice */}
			<div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
				<div className="flex items-start space-x-3">
					<Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
					<div>
						<h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
							Security Notice
						</h4>
						<p className="text-sm text-yellow-700 dark:text-yellow-300">
							All seed phrases are stored with enterprise-grade encryption.
							Access to this data should be strictly limited to authorized
							personnel only.
						</p>
					</div>
				</div>
			</div>
			{/* View Phrase Modal */}
			{showViewModal && phraseDetails && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Phrase Details
							</h3>
							<button
								onClick={() => {
									setShowViewModal(false);
									setSelectedPhrase(null);
									setPhraseDetails(null);
								}}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
								×
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Wallet Type
								</label>
								<p className="text-gray-900 dark:text-white">
									{phraseDetails.walletType.replace(/_/g, ' ')}
								</p>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Owner
								</label>
								<p className="text-gray-900 dark:text-white">
									{phraseDetails.user.name ||
										phraseDetails.user.email ||
										'Unknown User'}
								</p>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Created
								</label>
								<p className="text-gray-900 dark:text-white">
									{new Date(phraseDetails.createdAt).toLocaleDateString()}
								</p>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Seed Phrase
								</label>
								<div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
									<p className="text-sm font-mono text-gray-900 dark:text-white break-all">
										{showSensitive
											? phraseDetails.phrase
											: '••••••••••••••••••••••••'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PhrasesStatsComponent;
