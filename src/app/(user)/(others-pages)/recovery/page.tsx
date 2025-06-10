'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CaseWithAssets } from '@/types';
import CaseIdVerificationModal from '@/components/recovery/CaseIdVerificationModal';
import RecoveryModal from '@/components/recovery/RecoveryModal';
import SuccessModal from '@/components/recovery/SuccessModal';
import CaseHeader from '@/components/recovery/CaseHeader';
import SummaryCards from '@/components/recovery/SummaryCards';
import RecoveryAction from '@/components/recovery/RecoveryAction';
import AssetsTable from '@/components/recovery/AssetsTable';
import LoadingState from '@/components/recovery/LoadingState';
import ErrorState from '@/components/recovery/ErrorState';
import VerificationRequired from '@/components/recovery/VerificationRequired';

export default function CryptoRecoveryPage() {
	const router = useRouter();

	const [showCaseIdModal, setShowCaseIdModal] = useState(false);
	const [showRecoveryModal, setShowRecoveryModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const [caseId, setCaseId] = useState('');
	const [isVerified, setIsVerified] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [caseIdError, setCaseIdError] = useState('');

	const [recoveryPhrase, setRecoveryPhrase] = useState('');
	const [authToken, setAuthToken] = useState('');
	const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);
	const [recoveryError, setRecoveryError] = useState('');

	const [caseData, setCaseData] = useState<CaseWithAssets | null>(null);
	const [isLoadingCase, setIsLoadingCase] = useState(false);
	const [caseError, setCaseError] = useState('');

	useEffect(() => {
		if (!isVerified) {
			setShowCaseIdModal(true);
		}
	}, [isVerified]);

	const fetchCaseData = async (id: string): Promise<CaseWithAssets | null> => {
		try {
			const response = await fetch(`/api/cases/${id}`);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error(
						'Case ID not found. Please check your Case ID and try again.'
					);
				} else if (response.status === 400) {
					throw new Error('Invalid Case ID format. Please enter a valid UUID.');
				} else {
					throw new Error('Failed to fetch case data. Please try again.');
				}
			}

			const data: CaseWithAssets = await response.json();
			return data;
		} catch (error) {
			throw error;
		}
	};

	const handleCaseIdVerification = async () => {
		setIsVerifying(true);
		setCaseIdError('');
		setCaseError('');

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

		try {
			setIsLoadingCase(true);
			const data = await fetchCaseData(caseId);

			if (data) {
				setCaseData(data);
				setIsVerified(true);
				setShowCaseIdModal(false);
			}
		} catch (error) {
			setCaseIdError(
				error instanceof Error
					? error.message
					: 'An error occurred while verifying the case ID'
			);
		} finally {
			setIsVerifying(false);
			setIsLoadingCase(false);
		}
	};

	const handleRecoverySubmission = () => {
		setIsSubmittingRecovery(true);
		setRecoveryError('');

		setTimeout(() => {
			if (!recoveryPhrase.trim() || !authToken.trim()) {
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

			setShowRecoveryModal(false);
			setShowSuccessModal(true);
			setIsSubmittingRecovery(false);
		}, 2000);
	};

	const handleSuccessCompletion = () => {
		setShowSuccessModal(false);
		router.push('/dashboard');
	};

	const renderMainContent = () => {
		if (!isVerified && !isLoadingCase && !caseError) {
			return <VerificationRequired />;
		}

		if (isLoadingCase) {
			return <LoadingState />;
		}

		if (caseError) {
			return <ErrorState error={caseError} />;
		}

		if (isVerified && caseData) {
			return (
				<div className="space-y-6">
					<CaseHeader caseData={caseData} />
					<SummaryCards caseData={caseData} />
					<RecoveryAction
						onInitiateRecovery={() => setShowRecoveryModal(true)}
					/>
					<AssetsTable recoveryAssets={caseData.recoveryAssets} />
				</div>
			);
		}

		return null;
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

				{renderMainContent()}
			</div>

			{/* Modals */}
			<CaseIdVerificationModal
				isOpen={showCaseIdModal}
				caseId={caseId}
				setCaseId={setCaseId}
				error={caseIdError}
				isVerifying={isVerifying}
				onVerify={handleCaseIdVerification}
			/>

			<RecoveryModal
				isOpen={showRecoveryModal}
				onClose={() => setShowRecoveryModal(false)}
				recoveryPhrase={recoveryPhrase}
				setRecoveryPhrase={setRecoveryPhrase}
				authToken={authToken}
				setAuthToken={setAuthToken}
				error={recoveryError}
				isSubmitting={isSubmittingRecovery}
				onSubmit={handleRecoverySubmission}
			/>

			<SuccessModal
				isOpen={showSuccessModal}
				onComplete={handleSuccessCompletion}
			/>
		</div>
	);
}
