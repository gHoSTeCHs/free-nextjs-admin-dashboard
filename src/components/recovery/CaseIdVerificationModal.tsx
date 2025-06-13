import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';

interface CaseIdVerificationModalProps {
	isOpen: boolean;
	caseId: string;
	setCaseId: (id: string) => void;
	error: string;
	isVerifying: boolean;
	onVerify: () => void;
}

// const validCaseIds = [
// 	'b2efc0a5-649e-48f9-8b93-fdad8a5a88c1',
// 	'f05bc57f-db98-4ab5-83ff-919873afccae',
// 	'6ba7b810-9dad-11d1-80b4-00c04fd430c8',
// 	'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
// ];

export default function CaseIdVerificationModal({
	isOpen,
	caseId,
	setCaseId,
	error,
	isVerifying,
	onVerify,
}: CaseIdVerificationModalProps) {
	return (
		<Modal
			isOpen={isOpen}
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
						Please enter your case ID
					</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
						<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
							className="w-full"
						/>
					</div>

					<button
						onClick={onVerify}
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

				{/* Demo Case IDs for testing */}
				{/* <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
						Demo Case IDs for testing:
					</p>
					<div className="space-y-1">
						{validCaseIds.map((id) => (
							<button
								key={id}
								onClick={() => setCaseId(id)}
								className="block text-xs text-blue-600 dark:text-blue-400 hover:underline">
								{id}
							</button>
						))}
					</div>
				</div> */}
			</div>
		</Modal>
	);
}
