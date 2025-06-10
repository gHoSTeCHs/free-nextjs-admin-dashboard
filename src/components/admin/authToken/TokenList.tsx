'use client';

import React from 'react';
import { Key } from 'lucide-react';
import TokenCard from './TokenCard';
import { AuthToken } from '@/types';

interface TokenListProps {
	tokens: AuthToken[];
	searchToken: string;
	onEdit: (token: AuthToken) => void;
	onDelete: (tokenId: string) => void;
	onCopy: (token: string, tokenId: string) => void;
	copiedTokenId: string | null;
	onCreateToken: () => void;
}

const TokenList: React.FC<TokenListProps> = ({
	tokens,
	searchToken,
	onEdit,
	onDelete,
	onCopy,
	copiedTokenId,
	onCreateToken,
}) => {
	if (tokens.length === 0) {
		return (
			<div className="text-center py-8">
				<Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p className="text-gray-500 dark:text-gray-400">
					{searchToken
						? 'No tokens found matching your search'
						: 'No auth tokens found'}
				</p>
				<button
					onClick={onCreateToken}
					className="mt-4 text-purple-500 hover:text-purple-600 font-medium">
					Create your first auth token
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{tokens.map((token) => (
				<TokenCard
					key={token.id}
					token={token}
					onEdit={onEdit}
					onDelete={onDelete}
					onCopy={onCopy}
					copiedTokenId={copiedTokenId}
				/>
			))}
		</div>
	);
};

export default TokenList;
