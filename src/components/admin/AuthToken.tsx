'use client';

import { useAuthTokens } from '@/hooks/useAuthTokens';
import SearchHeader from './authToken/SearchHeader';
import { AuthToken } from '@/types';
import { useState } from 'react';
import TokenList from './authToken/TokenList';
import CreateTokenModal from './authToken/CreateTokenModal';
import EditTokenModal from './authToken/EditTokenModal';

interface Case {
	id: string;
	title: string;
}

const mockCases: Case[] = [
	{ id: 'case-001', title: 'Bitcoin Wallet Recovery' },
	{ id: 'case-002', title: 'Ethereum Smart Contract Issue' },
	{ id: 'case-003', title: 'Lost Private Keys Recovery' },
];

interface AuthTokensSectionProps {
	onCreateToken?: () => void;
}

const AuthTokensSection: React.FC<AuthTokensSectionProps> = () => {
	const {
		filteredTokens,
		searchToken,
		setSearchToken,
		copiedTokenId,
		createToken,
		updateToken,
		deleteToken,
		copyToClipboard,
	} = useAuthTokens();

	const [selectedToken, setSelectedToken] = useState<AuthToken | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const handleEditToken = (token: AuthToken) => {
		setSelectedToken(token);
		setIsEditModalOpen(true);
	};

	const handleCreateToken = () => {
		setIsCreateModalOpen(true);
	};

	return (
		<>
			<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
				<SearchHeader
					searchToken={searchToken}
					onSearchChange={setSearchToken}
					onCreateToken={handleCreateToken}
				/>

				<TokenList
					tokens={filteredTokens}
					searchToken={searchToken}
					onEdit={handleEditToken}
					onDelete={deleteToken}
					onCopy={copyToClipboard}
					copiedTokenId={copiedTokenId}
					onCreateToken={handleCreateToken}
				/>
			</div>

			<CreateTokenModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreateToken={createToken}
				cases={mockCases}
			/>

			<EditTokenModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onUpdateToken={updateToken}
				token={selectedToken}
				cases={mockCases}
			/>
		</>
	);
};

export default AuthTokensSection;
