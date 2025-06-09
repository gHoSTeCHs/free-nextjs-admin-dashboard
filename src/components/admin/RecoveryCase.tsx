'use client';

import React, { useState, useMemo, JSX } from 'react';
import {
	Search,
	Plus,
	Eye,
	Edit,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Shield,
	Key,
	Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { Case, PRIORITY, STATUS } from '@/generated/prisma/client';

interface RecoveryCasesSectionProps {
	cases: Case[];
	onViewCase?: (caseId: string) => void;
	onEditCase?: (caseId: string) => void;
	onCreateCase?: () => void;
}

const RecoveryCasesSection: React.FC<RecoveryCasesSectionProps> = ({
	cases,
	onViewCase,
	onEditCase,
	onCreateCase,
}) => {
	const [searchCaseId, setSearchCaseId] = useState('');

	const filteredCases = useMemo(() => {
		if (searchCaseId.trim() === '') {
			return cases;
		}
		return cases.filter(
			(recoveryCase) =>
				recoveryCase.id.toLowerCase().includes(searchCaseId.toLowerCase()) ||
				recoveryCase.title.toLowerCase().includes(searchCaseId.toLowerCase())
		);
	}, [cases, searchCaseId]);

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const handleSearch = (caseId: string): void => {
		setSearchCaseId(caseId);
	};

	const getStatusIcon = (status: STATUS): JSX.Element => {
		switch (status) {
			case 'COMPLETED':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case 'INPROGRESS':
				return <Clock className="w-4 h-4 text-blue-500" />;
			case 'CANCELLED':
				return <XCircle className="w-4 h-4 text-red-500" />;
			case 'PENDING':
				return <AlertCircle className="w-4 h-4 text-yellow-500" />;
		}
	};

	const getStatusColor = (status: STATUS): string => {
		switch (status) {
			case 'CANCELLED':
				return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
			case 'COMPLETED':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
			case 'INPROGRESS':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
		}
	};

	const getPriorityColor = (priority: PRIORITY): string => {
		switch (priority) {
			case 'HIGH':
				return 'border-l-red-500';
			case 'MEDIUM':
				return 'border-l-yellow-500';
			case 'LOW':
				return 'border-l-green-500';
			default:
				return 'border-l-gray-500';
		}
	};

	const formatStatus = (status: STATUS): string => {
		return status.replace('-', ' ');
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Recovery Cases
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Manage your crypto asset recovery cases
					</p>
				</div>

				<div className="flex items-center space-x-3 w-full sm:w-auto">
					<div className="relative flex-1 sm:flex-initial">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search by Case ID..."
							value={searchCaseId}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
						/>
					</div>

					<Link
						href="/admincase"
						className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap">
						<Plus className="w-4 h-4" />
						<span>New Case</span>
					</Link>
				</div>
			</div>

			<div className="space-y-4">
				{filteredCases.length === 0 ? (
					<div className="text-center py-8">
						<Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-500 dark:text-gray-400">
							{searchCaseId
								? 'No cases found matching your search'
								: 'No recovery cases found'}
						</p>
						<button
							onClick={onCreateCase}
							className="mt-4 text-purple-500 hover:text-purple-600 font-medium">
							Create your first recovery case
						</button>
					</div>
				) : (
					filteredCases.map((recoveryCase) => (
						<div
							key={recoveryCase.id}
							className={`border-l-4 ${getPriorityColor(
								recoveryCase.priority
							)} bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow`}>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center space-x-3 mb-2">
										<div className="flex items-center space-x-1">
											{getStatusIcon(recoveryCase.status)}
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													recoveryCase.status
												)}`}>
												{formatStatus(recoveryCase.status)}
											</span>
										</div>
										<span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
											ID: {recoveryCase.id}
										</span>
									</div>

									<h4 className="font-medium text-gray-900 dark:text-white mb-2">
										{recoveryCase.title}
									</h4>

									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
										<div className="flex items-center space-x-2">
											<Wallet className="w-4 h-4 text-blue-500" />
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													Assets
												</p>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{recoveryCase.assetsToRecover}
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-2">
											<Shield className="w-4 h-4 text-green-500" />
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													Current Value
												</p>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{formatCurrency(recoveryCase.totalValue)}
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-2">
											<Key className="w-4 h-4 text-purple-500" />
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													Methods
												</p>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{recoveryCase.recoveryMethods}
												</p>
											</div>
										</div>

										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Last Updated
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{new Date(
													recoveryCase.lastUpdated
												).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-2 ml-4">
									<button
										onClick={() => onViewCase?.(recoveryCase.id)}
										className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
										title="View Case Details">
										<Eye className="w-4 h-4" />
									</button>
									<button
										onClick={() => onEditCase?.(recoveryCase.id)}
										className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
										title="Edit Case">
										<Edit className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default RecoveryCasesSection;
