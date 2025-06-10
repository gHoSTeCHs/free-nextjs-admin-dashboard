import { Modal } from '@/components/ui/modal';

interface SuccessModalProps {
	isOpen: boolean;
	onComplete: () => void;
}

export default function SuccessModal({
	isOpen,
	onComplete,
}: SuccessModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {}}
			showCloseButton={false}
			className="max-w-md mx-4">
			<div className="p-6 text-center">
				<div className="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
					<svg
						className="h-6 w-6 text-green-600 dark:text-green-400"
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
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
					Recovery Initiated Successfully
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
					Your crypto asset recovery request has been submitted. Our team will
					process your request and contact you within 24-48 hours.
				</p>
				<button
					onClick={onComplete}
					className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
					Continue to Dashboard
				</button>
			</div>
		</Modal>
	);
}
