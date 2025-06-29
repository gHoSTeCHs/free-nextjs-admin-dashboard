'use client';
import { createCase } from '@/actions/case';

import DatePicker from '@/components/form/date-picker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { Case, RecoveryAsset } from '@/generated/prisma/client';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface FormErrors {
	[key: string]: string;
}

const AdminCasePage = () => {
	const [caseData, setCaseData] = useState<Case>({
		id: uuidv4(),
		title: '',
		status: 'PENDING',
		assetsToRecover: 0,
		totalValue: 0,
		lastKnownValue: 0,
		recoveryMethods: 0,
		createdDate: new Date(),
		lastUpdated: new Date(),
		priority: 'MEDIUM',
	});

	const [recoveryAssets, setRecoveryAssets] = useState<RecoveryAsset[]>([
		{
			id: uuidv4(),
			asset: '',
			symbol: '',
			amount: 0,
			currentValue: 0,
			lastKnownPrice: 0,
			wall: 'MetaMask',
			lastAccessed: new Date(),
			status: 'Inaccessible',
			case_id: '',
		},
	]);

	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const errorsRef = useRef(errors);
	errorsRef.current = errors;

	const statusOptions = useMemo(
		() => [
			{ value: 'PENDING', label: 'Pending' },
			{ value: 'INPROGRESS', label: 'In Progress' },
			{ value: 'COMPLETED', label: 'Completed' },
			{ value: 'CANCELLED', label: 'Cancelled' },
		],
		[]
	);

	const priorityOptions = useMemo(
		() => [
			{ value: 'LOW', label: 'Low' },
			{ value: 'MEDIUM', label: 'Medium' },
			{ value: 'HIGH', label: 'High' },
			{ value: 'URGENT', label: 'Urgent' },
		],
		[]
	);

	const walletOptions = useMemo(
		() => [
			{ value: 'MetaMask', label: 'MetaMask' },
			{ value: 'Hardware_Wallet', label: 'Hardware Wallet' },
			{ value: 'Phantom_Wallet', label: 'Phantom Wallet' },
			{ value: 'Trust_Wallet', label: 'Trust Wallet' },
			{ value: 'Coinbase_Wallet', label: 'Coinbase Wallet' },
			{ value: 'WalletConnect', label: 'WalletConnect' },
			{ value: 'Other', label: 'Other' },
		],
		[]
	);

	const assetStatusOptions = useMemo(
		() => [
			{ value: 'Inaccessible', label: 'Inaccessible' },
			{ value: 'Lost_Access', label: 'Lost Access' },
			{ value: 'Forgotten_Password', label: 'Forgotten Password' },
			{ value: 'Seed_Phrase_Lost', label: 'Seed Phrase Lost' },
			{ value: 'Hardware_Damaged', label: 'Hardware Damaged' },
			{ value: 'Exchange_Locked', label: 'Exchange Locked' },
		],
		[]
	);

	const calculatedTotals = useMemo(() => {
		const totalCurrentValue = recoveryAssets.reduce(
			(sum, asset) => sum + Number(asset.currentValue || 0),
			0
		);

		const assetsCount = recoveryAssets.filter(
			(asset) => asset.asset.trim() && asset.symbol.trim()
		).length;

		return {
			totalValue: Number(totalCurrentValue),
			assetsToRecover: assetsCount,
		};
	}, [recoveryAssets]);

	const handleCaseChange = useCallback((field: keyof Case, value: unknown) => {
		setCaseData((prev) => ({ ...prev, [field]: value }));

		if (errorsRef.current[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	}, []);

	const handleAssetChange = useCallback(
		(index: number, field: keyof RecoveryAsset, value: string) => {
			setRecoveryAssets((prev) =>
				prev.map((asset, i) =>
					i === index ? { ...asset, [field]: value } : asset
				)
			);

			const errorKey = `asset_${index}_${field}`;
			if (errorsRef.current[errorKey]) {
				setErrors((prev) => ({ ...prev, [errorKey]: '' }));
			}
		},
		[]
	);

	const addRecoveryAsset = useCallback(() => {
		setRecoveryAssets((prev) => [
			...prev,
			{
				id: uuidv4(),
				case_id: '',
				asset: '',
				symbol: '',
				amount: 0,
				currentValue: 0,
				lastKnownPrice: 0,
				wall: 'MetaMask',
				lastAccessed: new Date(),
				status: 'Inaccessible',
			},
		]);
	}, []);

	const handleAssetDateChange = useCallback(
		(index: number, field: keyof RecoveryAsset) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const dateValue = new Date(e.target.value);
				setRecoveryAssets((prev) =>
					prev.map((asset, i) =>
						i === index ? { ...asset, [field]: dateValue } : asset
					)
				);
			},
		[]
	);

	const removeRecoveryAsset = useCallback((index: number) => {
		setRecoveryAssets((prev) => {
			if (prev.length <= 1) return prev;

			const newAssets = prev.filter((_, i) => i !== index);

			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				Object.keys(newErrors).forEach((key) => {
					if (key.startsWith(`asset_${index}_`)) {
						delete newErrors[key];
					}
				});
				return newErrors;
			});

			return newAssets;
		});
	}, []);

	const validateCaseData = useCallback((caseToValidate: Case) => {
		const newErrors: FormErrors = {};

		if (!caseToValidate.title.trim()) {
			newErrors.title = 'Case title is required';
		}

		if (caseToValidate.assetsToRecover < 1) {
			newErrors.assetsToRecover = 'Must have at least 1 asset to recover';
		}

		if (caseToValidate.totalValue < 0) {
			newErrors.totalValue = 'Total value cannot be negative';
		}

		if (caseToValidate.lastKnownValue < 0) {
			newErrors.lastKnownValue = 'Last known value cannot be negative';
		}

		if (caseToValidate.recoveryMethods < 1) {
			newErrors.recoveryMethods = 'Must have at least 1 recovery method';
		}

		return newErrors;
	}, []);

	const validateAssets = useCallback((assetsToValidate: RecoveryAsset[]) => {
		const newErrors: FormErrors = {};

		assetsToValidate.forEach((asset, index) => {
			if (!asset.asset.trim()) {
				newErrors[`asset_${index}_name`] = 'Asset name is required';
			}

			if (!asset.symbol.trim()) {
				newErrors[`asset_${index}_symbol`] = 'Asset symbol is required';
			}

			if (!asset.amount || asset.amount <= 0) {
				newErrors[`asset_${index}_amount`] = 'Valid amount is required';
			}

			if (!asset.currentValue || asset.currentValue < 0) {
				newErrors[`asset_${index}_currentValue`] =
					'Valid current value is required';
			}

			if (!asset.lastKnownPrice || asset.lastKnownPrice <= 0) {
				newErrors[`asset_${index}_lastKnownPrice`] =
					'Valid last known price is required';
			}
		});

		return newErrors;
	}, []);

	const handleSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault();

		setIsSubmitting(true);
		setSubmitSuccess(false);

		const updatedCaseData = {
			...caseData,
			totalValue: Number(calculatedTotals.totalValue),
			assetsToRecover: calculatedTotals.assetsToRecover,
			lastUpdated: new Date(),
		};

		const caseErrors = validateCaseData(updatedCaseData);
		const assetErrors = validateAssets(recoveryAssets);
		const allErrors = { ...caseErrors, ...assetErrors };

		if (Object.keys(allErrors).length > 0) {
			setErrors(allErrors);
			setIsSubmitting(false);
			return;
		}

		try {
			const submissionData = {
				case: {
					...updatedCaseData,
					totalValue: Number(updatedCaseData.totalValue),
					createdDate: new Date(updatedCaseData.createdDate),
				},
				assets: recoveryAssets.map((asset) => ({
					...asset,
					amount: Number(asset.amount),
					currentValue: Number(asset.currentValue),
					lastKnownPrice: Number(asset.lastKnownPrice),
					lastAccessed: new Date(asset.lastAccessed),
				})),
			};

			const result = await createCase(submissionData);

			if (result.success) {
				setSubmitSuccess(true);
				setErrors({});

				setTimeout(() => {
					setCaseData({
						id: uuidv4(),
						title: '',
						status: 'PENDING',
						assetsToRecover: 0,
						totalValue: 0,
						lastKnownValue: 0,
						recoveryMethods: 0,
						createdDate: new Date(),
						lastUpdated: new Date(),
						priority: 'MEDIUM',
					});
					setRecoveryAssets([
						{
							id: uuidv4(),
							case_id: '',
							asset: '',
							symbol: '',
							amount: 0,
							currentValue: 0,
							lastKnownPrice: 0,
							wall: 'MetaMask',
							lastAccessed: new Date(),
							status: 'Inaccessible',
						},
					]);
					setSubmitSuccess(false);
				}, 2000);
			} else {
				setErrors({
					submit: result.error || 'Failed to create case. Please try again.',
				});
			}
		} catch (error) {
			console.error('Submission error:', error);
			setErrors({ submit: 'Failed to create case. Please try again.' });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
			{/* Rest of your JSX remains the same */}
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Recovery Case Creation
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Create a new cryptocurrency recovery case with detailed asset
						information
					</p>
				</div>

				{/* Success Message */}
				{submitSuccess && (
					<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
						<div className="flex items-center">
							<AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
							<p className="text-green-800 dark:text-green-200">
								Case created successfully! Resetting form...
							</p>
						</div>
					</div>
				)}

				{/* Error Message */}
				{errors.submit && (
					<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
						<div className="flex items-center">
							<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
							<p className="text-red-800 dark:text-red-200">{errors.submit}</p>
						</div>
					</div>
				)}

				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<form onSubmit={handleSubmit} className="p-6 space-y-8">
						{/* Case Details Section */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
								Case Details
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<Label htmlFor="title">Case Title *</Label>
									<Input
										id="title"
										placeholder="Enter descriptive case title"
										value={caseData.title}
										onChange={(e) => handleCaseChange('title', e.target.value)}
										required
										className={errors.title ? 'border-red-500' : ''}
									/>
									{errors.title && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.title}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="status">Status</Label>
									<Select
										options={statusOptions}
										placeholder="Select case status"
										value={caseData.status}
										onChange={(e) => handleCaseChange('status', e.target.value)}
									/>
								</div>

								<div>
									<Label htmlFor="priority">Priority</Label>
									<Select
										options={priorityOptions}
										placeholder="Select priority level"
										value={caseData.priority}
										onChange={(e) =>
											handleCaseChange('priority', e.target.value)
										}
									/>
								</div>

								<div>
									<Label htmlFor="recoveryMethods">Recovery Methods *</Label>
									<Input
										id="recoveryMethods"
										type="number"
										min="1"
										placeholder="Number of recovery methods to try"
										value={caseData.recoveryMethods}
										onChange={(e) =>
											handleCaseChange(
												'recoveryMethods',
												parseInt(e.target.value) || 0
											)
										}
										required
										className={errors.recoveryMethods ? 'border-red-500' : ''}
									/>
									{errors.recoveryMethods && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.recoveryMethods}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="lastKnownValue">
										Last Known Total Value (USD)
									</Label>
									<Input
										id="lastKnownValue"
										type="number"
										min="1"
										step={1}
										placeholder="Last known total value"
										value={caseData.lastKnownValue}
										onChange={(e) =>
											handleCaseChange(
												'lastKnownValue',
												parseFloat(e.target.value) || 0
											)
										}
										className={errors.lastKnownValue ? 'border-red-500' : ''}
									/>
									{errors.lastKnownValue && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.lastKnownValue}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="createdDate">Created Date</Label>
									<DatePicker
										placeholder="Select case creation date"
										value={caseData.createdDate.toISOString().slice(0, 16)}
										onChange={(e) =>
											handleCaseChange('createdDate', new Date(e.target.value))
										}
										id="createdDate"
									/>
								</div>
							</div>

							{/* Auto-calculated fields display */}
							<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label>Assets to Recover (Auto-calculated)</Label>
									<div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
										{calculatedTotals.assetsToRecover}
									</div>
								</div>
								<div>
									<Label>Current Total Value (Auto-calculated)</Label>
									<div className="text-lg font-semibold text-green-600 dark:text-green-400">
										${calculatedTotals.totalValue}
									</div>
								</div>
							</div>
						</div>

						{/* Recovery Assets Section */}
						<div className="space-y-6">
							<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Recovery Assets
								</h3>
								<button
									type="button"
									onClick={addRecoveryAsset}
									className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
									<Plus className="w-4 h-4" />
									Add Asset
								</button>
							</div>

							{recoveryAssets.map((asset, index) => (
								<div
									key={asset.id}
									className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
									<div className="flex items-center justify-between">
										<h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
											Asset #{index + 1}
										</h4>
										{recoveryAssets.length > 1 && (
											<button
												type="button"
												onClick={() => removeRecoveryAsset(index)}
												className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
												title="Remove Asset">
												<Trash2 className="w-4 h-4" />
											</button>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										<div>
											<Label>Asset Name *</Label>
											<Input
												placeholder="e.g., Bitcoin"
												value={asset.asset}
												onChange={(e) =>
													handleAssetChange(index, 'asset', e.target.value)
												}
												required
												className={
													errors[`asset_${index}_name`] ? 'border-red-500' : ''
												}
											/>
											{errors[`asset_${index}_name`] && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors[`asset_${index}_name`]}
												</p>
											)}
										</div>

										<div>
											<Label>Symbol *</Label>
											<Input
												placeholder="e.g., BTC"
												value={asset.symbol}
												onChange={(e) =>
													handleAssetChange(
														index,
														'symbol',
														e.target.value.toUpperCase()
													)
												}
												required
												className={
													errors[`asset_${index}_symbol`]
														? 'border-red-500'
														: ''
												}
											/>
											{errors[`asset_${index}_symbol`] && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors[`asset_${index}_symbol`]}
												</p>
											)}
										</div>

										<div>
											<Label>Amount *</Label>
											<Input
												type="number"
												placeholder="Amount owned"
												value={asset.amount}
												onChange={(e) =>
													handleAssetChange(index, 'amount', e.target.value)
												}
												required
												className={
													errors[`asset_${index}_amount`]
														? 'border-red-500'
														: ''
												}
											/>
											{errors[`asset_${index}_amount`] && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors[`asset_${index}_amount`]}
												</p>
											)}
										</div>

										<div>
											<Label>Current Value (USD) *</Label>
											<Input
												type="number"
												step={1}
												min="1"
												placeholder="Current market value"
												value={asset.currentValue}
												onChange={(e) =>
													handleAssetChange(
														index,
														'currentValue',
														e.target.value
													)
												}
												required
												className={
													errors[`asset_${index}_currentValue`]
														? 'border-red-500'
														: ''
												}
											/>
											{errors[`asset_${index}_currentValue`] && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors[`asset_${index}_currentValue`]}
												</p>
											)}
										</div>

										<div>
											<Label>Last Known Price (USD) *</Label>
											<Input
												type="number"
												step={1}
												min="1"
												placeholder="Price when last accessed"
												value={asset.lastKnownPrice}
												onChange={(e) =>
													handleAssetChange(
														index,
														'lastKnownPrice',
														e.target.value
													)
												}
												required
												className={
													errors[`asset_${index}_lastKnownPrice`]
														? 'border-red-500'
														: ''
												}
											/>
											{errors[`asset_${index}_lastKnownPrice`] && (
												<p className="mt-1 text-sm text-red-600 dark:text-red-400">
													{errors[`asset_${index}_lastKnownPrice`]}
												</p>
											)}
										</div>

										<div>
											<Label>Wallet Type</Label>
											<Select
												options={walletOptions}
												placeholder="Select wallet type"
												value={asset.wall}
												onChange={(e) =>
													handleAssetChange(index, 'wall', e.target.value)
												}
											/>
										</div>

										<div>
											<Label>Asset Status</Label>
											<Select
												options={assetStatusOptions}
												placeholder="Select asset status"
												value={asset.status}
												onChange={(e) =>
													handleAssetChange(index, 'status', e.target.value)
												}
											/>
										</div>

										<div className="md:col-span-2">
											<Label>Last Accessed</Label>
											<DatePicker
												placeholder="Select last accessed date"
												value={new Date(
													asset.lastAccessed
												).toLocaleDateString()}
												onChange={handleAssetDateChange(index, 'lastAccessed')}
												id={`lastAccessed_${index}`}
											/>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Submit Button */}
						<div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
								<Save className="w-4 h-4" />
								{isSubmitting ? 'Creating Case...' : 'Create Recovery Case'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AdminCasePage;
