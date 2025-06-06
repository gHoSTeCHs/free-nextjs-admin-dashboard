'use client';

import React, { useState } from 'react';
import {
	Users,
	UserCheck,
	UserX,
	Activity,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
	Eye,
	EyeOff,
} from 'lucide-react';

interface UserStatsData {
	totalUsers: number;
	userGrowth: number;
	userGrowthAmount: number;
}

interface AdminUserStatsProps {
	userStatsData: UserStatsData;
}

const AdminUserStats: React.FC<AdminUserStatsProps> = ({ userStatsData }) => {
	const [showSensitive, setShowSensitive] = useState(true);

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('en-US').format(num);
	};

	const formatPercentage = (value: number) => {
		return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
	};

	return (
		<div className="mb-8">
			<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							User Statistics
						</h2>
						<p className="text-gray-500 dark:text-gray-400">
							Monitor user engagement and growth
						</p>
					</div>
					<button
						onClick={() => setShowSensitive(!showSensitive)}
						className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
						title={
							showSensitive ? 'Hide sensitive data' : 'Show sensitive data'
						}>
						{showSensitive ? (
							<Eye className="w-5 h-5" />
						) : (
							<EyeOff className="w-5 h-5" />
						)}
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
						<div className="flex items-center justify-between mb-4">
							<Users className="w-8 h-8" />
							<div className="text-right">
								<p className="text-sm opacity-80">Total Users</p>
								<p className="text-2xl font-bold">
									{showSensitive
										? formatNumber(userStatsData.totalUsers)
										: '••••••'}
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							{userStatsData.userGrowth > 0 ? (
								<ArrowUpRight className="w-4 h-4" />
							) : (
								<ArrowDownRight className="w-4 h-4" />
							)}
							<span className="text-sm">
								{formatPercentage(userStatsData.userGrowth)} (
								{formatNumber(userStatsData.userGrowthAmount)} new)
							</span>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
						<div className="flex items-center justify-between mb-4">
							<UserCheck className="w-8 h-8 text-green-500" />
							<div className="text-right">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Active Users (24h)
								</p>
								<p className="text-xl font-bold text-green-500">
									{showSensitive ? formatNumber(15247) : '••••••'}
								</p>
							</div>
						</div>
						<div className="text-sm text-green-500">+12.3% from yesterday</div>
					</div>

					<div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
						<div className="flex items-center justify-between mb-4">
							<Activity className="w-8 h-8 text-orange-500" />
							<div className="text-right">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Avg. Session Time
								</p>
								<p className="text-xl font-bold text-gray-900 dark:text-white">
									24m 15s
								</p>
							</div>
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							+2.1% from last week
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
					<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<UserCheck className="w-6 h-6 text-green-500" />
							<div className="text-right">
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Verified Users
								</p>
								<p className="text-lg font-semibold text-gray-900 dark:text-white">
									{showSensitive ? formatNumber(8934) : '••••'}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<UserX className="w-6 h-6 text-red-500" />
							<div className="text-right">
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Suspended Users
								</p>
								<p className="text-lg font-semibold text-gray-900 dark:text-white">
									{showSensitive ? formatNumber(127) : '•••'}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<TrendingUp className="w-6 h-6 text-blue-500" />
							<div className="text-right">
								<p className="text-xs text-gray-500 dark:text-gray-400">
									New Signups (7d)
								</p>
								<p className="text-lg font-semibold text-gray-900 dark:text-white">
									{showSensitive ? formatNumber(1847) : '••••'}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<Activity className="w-6 h-6 text-purple-500" />
							<div className="text-right">
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Retention Rate
								</p>
								<p className="text-lg font-semibold text-gray-900 dark:text-white">
									73.2%
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminUserStats;
