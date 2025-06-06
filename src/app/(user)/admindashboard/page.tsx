import { checkUserRole } from '@/actions/user-role';
import AdminUserStats from '@/components/admin/AdminUserStats';
import React from 'react';

const AdminDashboard = () => {
	checkUserRole();

	const mockUserStatsData = {
		totalUsers: 47832,
		userGrowth: 8.5,
		userGrowthAmount: 3764,
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="flex">
				<main className="flex-1 p-6">
					<AdminUserStats userStatsData={mockUserStatsData} />
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
