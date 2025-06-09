'use client';
import AdminUserStats from '@/components/admin/AdminUserStats';
import RecoveryCasesSection from '@/components/admin/RecoveryCase';
import { Case } from '@/generated/prisma/client';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
	const [cases, setCases] = useState<Case[]>([]);

	const mockUserStatsData = {
		totalUsers: 47832,
		userGrowth: 8.5,
		userGrowthAmount: 3764,
	};

	const handleViewCase = (caseId: string): void => {
		console.log('Viewing case:', caseId);
	};

	const handleEditCase = (caseId: string): void => {
		console.log('Editing case:', caseId);
	};

	const handleCreateCase = (): void => {
		console.log('Creating new case');
	};

	useEffect(() => {
		const fetchCases = async () => {
			try {
				const response = await fetch('/api/cases');
				const data = await response.json();
				setCases(data);

				console.log('Cases:', data);
			} catch (error) {
				console.error('Error fetching cases:', error);
			}
		};

		fetchCases();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="flex">
				<main className="flex-1 ">
					<AdminUserStats userStatsData={mockUserStatsData} />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<RecoveryCasesSection
							cases={cases}
							onViewCase={handleViewCase}
							onEditCase={handleEditCase}
							onCreateCase={handleCreateCase}
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
