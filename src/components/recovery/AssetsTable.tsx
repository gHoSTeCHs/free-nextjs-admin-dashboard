import { RecoveryAsset } from '@/generated/prisma/client';

export default function AssetsTable({
	recoveryAssets,
}: {
	recoveryAssets: RecoveryAsset[];
}) {
	const getStatusBadge = (status: string) => {
		const baseClasses =
			'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

		switch (status) {
			case 'Inaccessible':
				return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
			case 'Lost_Access':
				return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400`;
			case 'Forgotten_Password':
				return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
			default:
				return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
		}
	};

	const getWalletTypeDisplay = (walletType: string) => {
		return walletType.replace(/_/g, ' ');
	};

	const getStatusDisplay = (status: string) => {
		return status.replace(/_/g, ' ');
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
					Your Crypto Assets
				</h2>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 dark:bg-gray-900/50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Asset
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Amount
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Current Value
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Wallet Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Last Accessed
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{recoveryAssets.map((asset) => (
							<tr
								key={asset.id}
								className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
											<span className="text-white text-xs font-bold">
												{asset.symbol.substring(0, 2)}
											</span>
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{asset.asset}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{asset.symbol}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										{asset.amount.toFixed(8)}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{asset.symbol}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										${asset.currentValue.toLocaleString()}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										Last: ${asset.lastKnownPrice.toLocaleString()}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900 dark:text-white">
										{getWalletTypeDisplay(asset.wallet)}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className={getStatusBadge(asset.status)}>
										{getStatusDisplay(asset.status)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{formatDate(
										new Date(asset.lastAccessed).toLocaleDateString()
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
