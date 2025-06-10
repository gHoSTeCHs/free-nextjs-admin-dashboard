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

interface AuthTokensSectionProps {
	onCreateToken?: () => void;
	cases: Case[];
}

const AuthTokensSection: React.FC<AuthTokensSectionProps> = ({ cases }) => {
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

	const handleUpdateToken = async (
		tokenId: string,
		updates: Partial<Omit<AuthToken, 'id' | 'createdAt'>>
	) => {
		try {
			await updateToken(tokenId, updates);
			setIsEditModalOpen(false);
			setSelectedToken(null);
		} catch (error) {
			console.error('Failed to update token:', error);
		}
	};

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
				cases={cases}
			/>

			<EditTokenModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedToken(null);
				}}
				onUpdateToken={handleUpdateToken}
				token={selectedToken}
				cases={cases}
			/>
		</>
	);
};

export default AuthTokensSection;
