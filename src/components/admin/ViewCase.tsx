'use client';

import React from 'react';
import {
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Key,
	Wallet,
	FileText,
	DollarSign,
	Activity,
} from 'lucide-react';
import {
	PRIORITY,
	STATUS,
	WALL_TYPE,
	ASSET_STATUS,
} from '@/generated/prisma/client';
import { CaseWithAssets } from '@/types';
import { Modal } from '@/components/ui/modal'; // Adjust path as needed

interface ViewCaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	case: CaseWithAssets | null;
}

const ViewCaseModal: React.FC<ViewCaseModalProps> = ({
	isOpen,
	onClose,
	case: recoveryCase,
}) => {
	if (!recoveryCase) return null;

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const getStatusIcon = (status: STATUS): React.ReactElement => {
		switch (status) {
			case 'COMPLETED':
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case 'INPROGRESS':
				return <Clock className="w-5 h-5 text-blue-500" />;
			case 'CANCELLED':
				return <XCircle className="w-5 h-5 text-red-500" />;
			case 'PENDING':
				return <AlertCircle className="w-5 h-5 text-yellow-500" />;
		}
	};

	const getStatusColor = (status: STATUS): string => {
		switch (status) {
			case 'COMPLETED':
				return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
			case 'INPROGRESS':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
		}
	};

	const getPriorityColor = (priority: PRIORITY): string => {
		switch (priority) {
			case 'URGENT':
				return 'bg-red-500 text-white';
			case 'HIGH':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
			case 'MEDIUM':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
			case 'LOW':
				return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
		}
	};

	const getAssetStatusColor = (status: ASSET_STATUS): string => {
		switch (status) {
			case 'Inaccessible':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
			case 'Lost_Access':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
			case 'Forgotten_Password':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
		}
	};

	const formatWalletType = (walletType: WALL_TYPE): string => {
		return walletType.replace(/_/g, ' ');
	};

	const formatAssetStatus = (status: ASSET_STATUS): string => {
		return status.replace(/_/g, ' ');
	};

	const formatStatus = (status: STATUS): string => {
		return status.replace(/([A-Z])/g, ' $1').trim();
	};

	const formatPriority = (priority: PRIORITY): string => {
		return priority.charAt(0) + priority.slice(1).toLowerCase();
	};

	const getWalletIcon = (symbol: string): string => {
		const colors = [
			'from-blue-500 to-purple-600',
			'from-green-500 to-blue-600',
			'from-purple-500 to-pink-600',
			'from-orange-500 to-red-600',
		];
		const index = symbol.charCodeAt(0) % colors.length;
		return colors[index];
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
			{/* Header */}
			<div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-3xl">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							{getStatusIcon(recoveryCase.status)}
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
									recoveryCase.status
								)}`}>
								{formatStatus(recoveryCase.status)}
							</span>
						</div>
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
								recoveryCase.priority
							)}`}>
							{formatPriority(recoveryCase.priority)} Priority
						</span>
					</div>
				</div>
				<div className="mt-4">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{recoveryCase.title}
					</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
						Case ID: {recoveryCase.id}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="p-6 space-y-6">
				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-blue-500 rounded-lg">
								<DollarSign className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
									Total Value
								</p>
								<p className="text-xl font-bold text-blue-900 dark:text-blue-100">
									{formatCurrency(recoveryCase.totalValue)}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-green-500 rounded-lg">
								<Wallet className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-green-600 dark:text-green-400 font-medium">
									Assets
								</p>
								<p className="text-xl font-bold text-green-900 dark:text-green-100">
									{recoveryCase.assetsToRecover}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-purple-500 rounded-lg">
								<Key className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
									Recovery Methods
								</p>
								<p className="text-xl font-bold text-purple-900 dark:text-purple-100">
									{recoveryCase.recoveryMethods}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Case Details */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Case Information */}
					<div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
							<FileText className="w-5 h-5 mr-2" />
							Case Information
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Created:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{new Date(recoveryCase.createdDate).toLocaleDateString(
										'en-US',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										}
									)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Last Updated:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{new Date(recoveryCase.lastUpdated).toLocaleDateString(
										'en-US',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										}
									)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Last Known Value:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{formatCurrency(recoveryCase.lastKnownValue)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Recovery Methods:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{recoveryCase.recoveryMethods}
								</span>
							</div>
						</div>
					</div>

					{/* Case Statistics */}
					<div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
							<Activity className="w-5 h-5 mr-2" />
							Case Statistics
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Total Assets:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{recoveryCase.recoveryAssets?.length || 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Current Value:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{formatCurrency(recoveryCase.totalValue)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Value Change:
								</span>
								<span
									className={`text-sm font-medium ${
										recoveryCase.totalValue >= recoveryCase.lastKnownValue
											? 'text-green-600 dark:text-green-400'
											: 'text-red-600 dark:text-red-400'
									}`}>
									{recoveryCase.totalValue >= recoveryCase.lastKnownValue
										? '+'
										: ''}
									{formatCurrency(
										recoveryCase.totalValue - recoveryCase.lastKnownValue
									)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Status:
								</span>
								<span className="text-sm text-gray-900 dark:text-white">
									{formatStatus(recoveryCase.status)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Recovery Assets */}
				{recoveryCase.recoveryAssets &&
					recoveryCase.recoveryAssets.length > 0 && (
						<div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
							<div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
									<Activity className="w-5 h-5 mr-2" />
									Recovery Assets ({recoveryCase.recoveryAssets.length})
								</h3>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50 dark:bg-gray-800">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Asset
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Amount
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Current Value
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Wallet
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 dark:divide-gray-600">
										{recoveryCase.recoveryAssets.map((asset) => (
											<tr
												key={asset.id}
												className="hover:bg-gray-50 dark:hover:bg-gray-800">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div
															className={`h-8 w-8 bg-gradient-to-r ${getWalletIcon(
																asset.symbol
															)} rounded-full flex items-center justify-center mr-3`}>
															<span className="text-white text-xs font-bold">
																{asset.symbol.substring(0, 2)}
															</span>
														</div>
														<div>
															<div className="text-sm font-medium text-gray-900 dark:text-white">
																{asset.asset}
															</div>
															<div className="text-sm text-gray-500 dark:text-gray-400">
																{asset.symbol}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900 dark:text-white">
														{asset.amount.toLocaleString()}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{asset.symbol}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900 dark:text-white">
														{formatCurrency(asset.currentValue)}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														Last: {formatCurrency(asset.lastKnownPrice)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{formatWalletType(asset.wall)}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														Last accessed:{' '}
														{new Date(asset.lastAccessed).toLocaleDateString()}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssetStatusColor(
															asset.status
														)}`}>
														{formatAssetStatus(asset.status)}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

				{/* Timeline */}
				<div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
						<Clock className="w-5 h-5 mr-2" />
						Recovery Timeline
					</h3>
					<div className="space-y-4">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
							<div>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									Case Created
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{new Date(recoveryCase.createdDate).toLocaleDateString()} at{' '}
									{new Date(recoveryCase.createdDate).toLocaleTimeString()}
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
							<div>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									Last Updated
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{new Date(recoveryCase.lastUpdated).toLocaleDateString()} at{' '}
									{new Date(recoveryCase.lastUpdated).toLocaleTimeString()}
								</p>
							</div>
						</div>
						{recoveryCase.status === 'COMPLETED' && (
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Case Completed
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Recovery process successfully completed
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ViewCaseModal;
