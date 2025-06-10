import { useState, useMemo } from 'react';
import { AuthToken } from '@/types';

const mockTokens: AuthToken[] = [
	{
		id: '1',
		token: 'abc123def456',
		caseId: 'case-001',
		caseTitle: 'Bitcoin Wallet Recovery',
		createdAt: '2024-01-15T10:30:00Z',
		lastUsed: '2024-01-20T14:22:00Z',
		isActive: true,
	},
	{
		id: '2',
		token: 'xyz789uvw012',
		caseId: 'case-002',
		caseTitle: 'Ethereum Smart Contract Issue',
		createdAt: '2024-01-10T09:15:00Z',
		lastUsed: '2024-01-18T11:45:00Z',
		isActive: false,
	},
	{
		id: '3',
		token: 'mno345pqr678',
		caseId: 'case-001',
		caseTitle: 'Bitcoin Wallet Recovery',
		createdAt: '2024-01-08T16:20:00Z',
		isActive: true,
	},
];

export const useAuthTokens = () => {
	const [tokens, setTokens] = useState<AuthToken[]>(mockTokens);
	const [searchToken, setSearchToken] = useState('');
	const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

	const filteredTokens = useMemo(() => {
		if (searchToken.trim() === '') {
			return tokens;
		}
		return tokens.filter(
			(token) =>
				token.token.toLowerCase().includes(searchToken.toLowerCase()) ||
				token.caseTitle.toLowerCase().includes(searchToken.toLowerCase()) ||
				token.id.toLowerCase().includes(searchToken.toLowerCase())
		);
	}, [tokens, searchToken]);

	const createToken = (newTokenData: Omit<AuthToken, 'id' | 'createdAt'>) => {
		const newToken: AuthToken = {
			...newTokenData,
			id: Date.now().toString(),
			createdAt: new Date().toISOString(),
		};
		setTokens((prev) => [newToken, ...prev]);
	};

	const updateToken = (updatedToken: AuthToken) => {
		setTokens((prev) =>
			prev.map((token) => (token.id === updatedToken.id ? updatedToken : token))
		);
	};

	const deleteToken = (tokenId: string) => {
		if (confirm('Are you sure you want to delete this token?')) {
			setTokens((prev) => prev.filter((token) => token.id !== tokenId));
		}
	};

	const copyToClipboard = async (token: string, tokenId: string) => {
		try {
			await navigator.clipboard.writeText(token);
			setCopiedTokenId(tokenId);
			setTimeout(() => setCopiedTokenId(null), 2000);
		} catch (err) {
			console.error('Failed to copy token:', err);
		}
	};

	return {
		tokens,
		filteredTokens,
		searchToken,
		setSearchToken,
		copiedTokenId,
		createToken,
		updateToken,
		deleteToken,
		copyToClipboard,
	};
};
