'use client';

import React from 'react';
import { Key, Shield, Edit, Trash2, Copy, Check } from 'lucide-react';
import { AuthToken } from '@/types';

interface TokenCardProps {
	token: AuthToken;
	onEdit: (token: AuthToken) => void;
	onDelete: (tokenId: string) => void;
	onCopy: (token: string, tokenId: string) => void;
	copiedTokenId: string | null;
}

const TokenCard: React.FC<TokenCardProps> = ({
	token,
	onEdit,
	onDelete,
	onCopy,
	copiedTokenId,
}) => {
	return (
		<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center space-x-3 mb-2">
						<div className="flex items-center space-x-2">
							<Key className="w-4 h-4 text-purple-500" />
							<span className="font-mono text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
								{token.token}
							</span>
							<button
								onClick={() => onCopy(token.token, token.id)}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								title="Copy token">
								{copiedTokenId === token.id ? (
									<Check className="w-4 h-4 text-green-500" />
								) : (
									<Copy className="w-4 h-4" />
								)}
							</button>
						</div>
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${
								token.isActive
									? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
									: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
							}`}>
							{token.isActive ? 'Active' : 'Inactive'}
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
						<div className="flex items-center space-x-2">
							<Shield className="w-4 h-4 text-blue-500" />
							<div>
								<p className="text-xs text-gray-500 dark:text-gray-400">Case</p>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{token.caseTitle}
								</p>
							</div>
						</div>

						<div>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Created
							</p>
							<p className="text-sm font-medium text-gray-900 dark:text-white">
								{new Date(token.createdAt).toLocaleDateString()}
							</p>
						</div>

						<div>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Last Used
							</p>
							<p className="text-sm font-medium text-gray-900 dark:text-white">
								{token.lastUsed
									? new Date(token.lastUsed).toLocaleDateString()
									: 'Never'}
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center space-x-2 ml-4">
					<button
						onClick={() => onEdit(token)}
						className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
						title="Edit Token">
						<Edit className="w-4 h-4" />
					</button>
					<button
						onClick={() => onDelete(token.id)}
						className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
						title="Delete Token">
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default TokenCard;
