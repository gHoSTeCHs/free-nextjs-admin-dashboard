'use client';
import AdminUserStats from '@/components/admin/AdminUserStats';
import AuthTokensSection from '@/components/admin/AuthToken';
import RecoveryCasesSection from '@/components/admin/RecoveryCase';
import { CaseWithAssets } from '@/types';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AdminDashboard = () => {
	const {
		data: cases = [],
		error,
		isLoading,
		mutate,
	} = useSWR<CaseWithAssets[]>('/api/cases', fetcher, {
		refreshInterval: 30000,
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		dedupingInterval: 2000,
	});

	const mockUserStatsData = {
		totalUsers: 47832,
		userGrowth: 8.5,
		userGrowthAmount: 3764,
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						Loading dashboard...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 dark:text-red-400">
						Error loading dashboard data
					</p>
					<button
						onClick={() => mutate()}
						className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="flex">
				<main className="flex-1">
					<AdminUserStats userStatsData={mockUserStatsData} />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<RecoveryCasesSection cases={cases} />
						<AuthTokensSection cases={cases} />
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
