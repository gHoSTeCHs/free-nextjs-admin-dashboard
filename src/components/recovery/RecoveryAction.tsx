import { STATUS } from '@/generated/prisma/client';

interface RecoveryActionProps {
	onInitiateRecovery: () => void;
	caseStatus: STATUS;
}

export default function RecoveryAction({
	onInitiateRecovery,
	caseStatus,
}: RecoveryActionProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						Restoration Action Required
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Initiate restoration process for your cryptocurrency assets
					</p>
				</div>
				<button
					onClick={onInitiateRecovery}
					className={`inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors ${
						caseStatus === STATUS.INPROGRESS
							? 'opacity-50 cursor-not-allowed'
							: ''
					}`}>
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
					{caseStatus === STATUS.INPROGRESS
						? 'Restoration in progress'
						: 'Initiate Restoration'}
				</button>
			</div>
		</div>
	);
}
