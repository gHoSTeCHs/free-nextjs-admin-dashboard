import { CaseWithAssets } from '@/types';

interface SummaryCardsProps {
	caseData: CaseWithAssets;
}

export default function SummaryCards({ caseData }: SummaryCardsProps) {
	const getTotalAssetValue = () => {
		return caseData.totalValue.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
		});
	};

	const getLastKnownValue = () => {
		return caseData.lastKnownValue.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
		});
	};

	const cards = [
		{
			title: 'Current Asset Value',
			value: getTotalAssetValue(),
			icon: (
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
			),
			bgColor: 'bg-green-100 dark:bg-green-900/20',
		},
		{
			title: 'Last Known Value',
			value: getLastKnownValue(),
			icon: (
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
			),
			bgColor: 'bg-blue-100 dark:bg-blue-900/20',
		},
		{
			title: 'Assets to Restore',
			value: caseData.assetsToRecover.toString(),
			icon: (
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
			),
			bgColor: 'bg-orange-100 dark:bg-orange-900/20',
		},
		{
			title: 'Restoration Methods',
			value: caseData.recoveryMethods.toString(),
			icon: (
				<svg
					className="h-6 w-6 text-purple-600 dark:text-purple-400"
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
			),
			bgColor: 'bg-purple-100 dark:bg-purple-900/20',
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			{cards.map((card, index) => (
				<div
					key={index}
					className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								{card.title}
							</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">
								{card.value}
							</p>
						</div>
						<div
							className={`h-12 w-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
							{card.icon}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
