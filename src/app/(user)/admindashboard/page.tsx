'use client';
import { checkUserRole } from '@/actions/user-role';
import AdminUserStats from '@/components/admin/AdminUserStats';
import RecoveryCasesSection from '@/components/admin/RecoveryCase';
import React from 'react';

type CaseStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
type CasePriority = 'low' | 'medium' | 'high';

interface RecoveryCase {
	caseId: string;
	title: string;
	status: CaseStatus;
	assetsToRecover: number;
	totalValue: number;
	lastKnownValue: number;
	recoveryMethods: number;
	createdDate: string;
	lastUpdated: string;
	priority: CasePriority;
}

const AdminDashboard = () => {
	checkUserRole();

	const mockUserStatsData = {
		totalUsers: 47832,
		userGrowth: 8.5,
		userGrowthAmount: 3764,
	};

	const mockCases: RecoveryCase[] = [
		{
			caseId: '123e4567-e89b-12d3-a456-426614174000',
			title: 'Bitcoin Hardware Wallet Recovery',
			status: 'in-progress',
			assetsToRecover: 3,
			totalValue: 98450.0,
			lastKnownValue: 140180.0,
			recoveryMethods: 2,
			createdDate: '2024-01-15',
			lastUpdated: '2024-01-20',
			priority: 'high',
		},
		{
			caseId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
			title: 'Ethereum MetaMask Access Recovery',
			status: 'completed',
			assetsToRecover: 5,
			totalValue: 63000.0,
			lastKnownValue: 62800.0,
			recoveryMethods: 1,
			createdDate: '2024-02-01',
			lastUpdated: '2024-02-05',
			priority: 'medium',
		},
		{
			caseId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
			title: 'Multi-Asset Wallet Recovery',
			status: 'pending',
			assetsToRecover: 8,
			totalValue: 125300.0,
			lastKnownValue: 130500.0,
			recoveryMethods: 4,
			createdDate: '2024-03-01',
			lastUpdated: '2024-03-01',
			priority: 'low',
		},
	];

	const handleViewCase = (caseId: string): void => {
		console.log('Viewing case:', caseId);
	};

	const handleEditCase = (caseId: string): void => {
		console.log('Editing case:', caseId);
	};

	const handleCreateCase = (): void => {
		console.log('Creating new case');
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="flex">
				<main className="flex-1 ">
					<AdminUserStats userStatsData={mockUserStatsData} />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<RecoveryCasesSection
							cases={mockCases}
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
