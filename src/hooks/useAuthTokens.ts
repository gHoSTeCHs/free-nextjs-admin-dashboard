import { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthToken } from '@/types';
import {
	createAuthToken,
	updateAuthToken,
	deleteAuthToken,
	getAllAuthTokens,
	getAuthTokensByCase,
	updateTokenLastUsed,
	findActiveTokenByString,
} from '@/actions/authToken';

interface UseAuthTokensOptions {
	caseId?: string;
	activeOnly?: boolean;
	autoRefresh?: boolean;
	refreshInterval?: number;
}

export const useAuthTokens = (options: UseAuthTokensOptions = {}) => {
	const {
		caseId,
		activeOnly = false,
		autoRefresh = false,
		refreshInterval = 30000,
	} = options;

	const [tokens, setTokens] = useState<AuthToken[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchToken, setSearchToken] = useState('');
	const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

	// Filtered tokens based on search
	const filteredTokens = useMemo(() => {
		if (searchToken.trim() === '') {
			return tokens;
		}
		const searchLower = searchToken.toLowerCase();
		return tokens.filter(
			(token) =>
				token.token.toLowerCase().includes(searchLower) ||
				token.caseTitle.toLowerCase().includes(searchLower) ||
				token.id.toLowerCase().includes(searchLower) ||
				token.caseId.toLowerCase().includes(searchLower)
		);
	}, [tokens, searchToken]);

	// Fetch tokens function
	const fetchTokens = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			let fetchedTokens: AuthToken[];

			if (caseId) {
				// Fetch tokens for specific case
				fetchedTokens = await getAuthTokensByCase(caseId, activeOnly);
			} else {
				// Fetch all tokens
				fetchedTokens = await getAllAuthTokens(activeOnly);
			}

			setTokens(fetchedTokens);
		} catch (err) {
			console.error('Failed to fetch tokens:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
		} finally {
			setIsLoading(false);
		}
	}, [caseId, activeOnly]);

	// Create token function
	const createToken = useCallback(
		async (newTokenData: Omit<AuthToken, 'id' | 'createdAt' | 'lastUsed'>) => {
			try {
				setError(null);
				const tokenData = {
					...newTokenData,
					createdAt: new Date(),
					lastUsed: new Date(),
				};

				const newToken = await createAuthToken(tokenData);

				// Add to local state for immediate UI update
				setTokens((prev) => [newToken, ...prev]);

				return newToken;
			} catch (err) {
				console.error('Failed to create token:', err);
				const errorMessage =
					err instanceof Error ? err.message : 'Failed to create token';
				setError(errorMessage);
				throw new Error(errorMessage);
			}
		},
		[]
	);

	// Update token function
	const updateToken = useCallback(
		async (
			tokenId: string,
			updates: Partial<Omit<AuthToken, 'id' | 'createdAt'>>
		) => {
			try {
				setError(null);
				const updatedToken = await updateAuthToken(tokenId, updates);

				// Update local state for immediate UI update
				setTokens((prev) =>
					prev.map((token) => (token.id === tokenId ? updatedToken : token))
				);

				return updatedToken;
			} catch (err) {
				console.error('Failed to update token:', err);
				const errorMessage =
					err instanceof Error ? err.message : 'Failed to update token';
				setError(errorMessage);
				throw new Error(errorMessage);
			}
		},
		[]
	);

	// Delete token function
	const deleteToken = useCallback(async (tokenId: string) => {
		try {
			setError(null);
			await deleteAuthToken(tokenId);

			// Remove from local state for immediate UI update
			setTokens((prev) => prev.filter((token) => token.id !== tokenId));
		} catch (err) {
			console.error('Failed to delete token:', err);
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to delete token';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	}, []);

	// Mark token as used (update lastUsed timestamp)
	const markTokenAsUsed = useCallback(async (tokenId: string) => {
		try {
			const updatedToken = await updateTokenLastUsed(tokenId);

			// Update local state
			setTokens((prev) =>
				prev.map((token) => (token.id === tokenId ? updatedToken : token))
			);

			return updatedToken;
		} catch (err) {
			console.error('Failed to mark token as used:', err);
			// Don't throw here as this is often a background operation
		}
	}, []);

	// Find active token by token string
	const findTokenByString = useCallback(async (tokenString: string) => {
		try {
			return await findActiveTokenByString(tokenString);
		} catch (err) {
			console.error('Failed to find token:', err);
			return null;
		}
	}, []);

	// Copy token to clipboard
	const copyToClipboard = useCallback(
		async (token: string, tokenId: string) => {
			try {
				await navigator.clipboard.writeText(token);
				setCopiedTokenId(tokenId);

				// Auto-clear copied state after 2 seconds
				setTimeout(() => setCopiedTokenId(null), 2000);

				// Optionally mark token as used when copied
				await markTokenAsUsed(tokenId);
			} catch (err) {
				console.error('Failed to copy token:', err);
				setError('Failed to copy token to clipboard');
			}
		},
		[markTokenAsUsed]
	);

	// Refresh tokens manually
	const refreshTokens = useCallback(async () => {
		await fetchTokens();
	}, [fetchTokens]);

	// Toggle token active status
	const toggleTokenStatus = useCallback(
		async (tokenId: string, isActive: boolean) => {
			try {
				await updateToken(tokenId, { isActive });
			} catch (err) {
				console.error('Failed to toggle token status:', err);
				throw err;
			}
		},
		[updateToken]
	);

	// Get token statistics
	const tokenStats = useMemo(() => {
		const total = tokens.length;
		const active = tokens.filter((t) => t.isActive).length;
		const inactive = total - active;

		return {
			total,
			active,
			inactive,
		};
	}, [tokens]);

	// Initial fetch
	useEffect(() => {
		fetchTokens();
	}, [fetchTokens]);

	// Auto refresh setup
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			fetchTokens();
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [autoRefresh, refreshInterval, fetchTokens]);

	// Clear error after some time
	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => {
				setError(null);
			}, 5000); // Clear error after 5 seconds

			return () => clearTimeout(timeout);
		}
	}, [error]);

	return {
		// Data
		tokens,
		filteredTokens,
		tokenStats,

		// Loading states
		isLoading,
		error,

		// Search
		searchToken,
		setSearchToken,

		// UI states
		copiedTokenId,

		// Actions
		createToken,
		updateToken,
		deleteToken,
		refreshTokens,
		markTokenAsUsed,
		findTokenByString,
		copyToClipboard,
		toggleTokenStatus,

		// Utils
		clearError: () => setError(null),
	};
};
