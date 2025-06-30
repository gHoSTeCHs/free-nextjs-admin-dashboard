import { CaseWithAssets } from '@/types';

interface CaseHeaderProps {
	caseData: CaseWithAssets;
}

export default function CaseHeader({ caseData }: CaseHeaderProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						{caseData.title}
					</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Case ID: {caseData.id}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
							caseData.status === 'INPROGRESS'
								? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
								: caseData.status === 'COMPLETED'
								? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
								: caseData.status === 'PENDING'
								? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
								: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
						}`}>
						{caseData.status.replace('_', ' ')}
					</span>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
							caseData.priority === 'URGENT'
								? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
								: caseData.priority === 'HIGH'
								? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
								: caseData.priority === 'MEDIUM'
								? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
								: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
						}`}>
						{caseData.priority} Priority
					</span>
				</div>
			</div>
			<div className="text-sm text-gray-500 dark:text-gray-400">
				Created:{' '}
				{formatDate(new Date(caseData.createdDate).toLocaleDateString())} | Last
				Updated:{' '}
				{formatDate(new Date(caseData.lastUpdated).toLocaleDateString())}
			</div>
		</div>
	);
}
