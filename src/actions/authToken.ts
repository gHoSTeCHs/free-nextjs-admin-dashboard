 
'use server';
import { AuthToken } from '@/generated/prisma/client';
import { db } from '@/lib/db';

type CreateAuthTokenInput = Omit<AuthToken, 'id'>;
type UpdateAuthTokenInput = Partial<Omit<AuthToken, 'id'>>;

/**
 * Creates a new authentication token
 * @param values - Token data without id (auto-generated)
 * @returns Promise<AuthToken> - The created token
 * @throws Error if creation fails
 */
export const createAuthToken = async (
	values: CreateAuthTokenInput
): Promise<AuthToken> => {
	try {
		if (!values.token || values.token.trim() === '') {
			throw new Error('Token is required and cannot be empty');
		}
		if (!values.caseId || values.caseId.trim() === '') {
			throw new Error('Case ID is required and cannot be empty');
		}
		if (!values.caseTitle || values.caseTitle.trim() === '') {
			throw new Error('Case title is required and cannot be empty');
		}

		const tokenData: CreateAuthTokenInput = {
			...values,
			createdAt: values.createdAt || new Date(),
			lastUsed: values.lastUsed || new Date(),
			isActive: values.isActive ?? true,
		};

		return await db.authToken.create({
			data: tokenData,
		});
	} catch (error) {
		console.error('Error creating auth token:', error);
		throw new Error(
			`Failed to create auth token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Updates an existing authentication token
 * @param id - Token ID to update
 * @param values - Partial token data to update
 * @returns Promise<AuthToken> - The updated token
 * @throws Error if token not found or update fails
 */
export const updateAuthToken = async (
	id: string,
	values: UpdateAuthTokenInput
): Promise<AuthToken> => {
	try {
		if (!id || id.trim() === '') {
			throw new Error('Token ID is required');
		}

		const existingToken = await db.authToken.findUnique({
			where: { id },
		});

		if (!existingToken) {
			throw new Error(`Auth token with ID ${id} not found`);
		}

		if (
			values.token !== undefined &&
			(!values.token || values.token.trim() === '')
		) {
			throw new Error('Token cannot be empty');
		}
		if (
			values.caseId !== undefined &&
			(!values.caseId || values.caseId.trim() === '')
		) {
			throw new Error('Case ID cannot be empty');
		}
		if (
			values.caseTitle !== undefined &&
			(!values.caseTitle || values.caseTitle.trim() === '')
		) {
			throw new Error('Case title cannot be empty');
		}

		return await db.authToken.update({
			where: { id },
			data: values,
		});
	} catch (error) {
		console.error('Error updating auth token:', error);
		throw new Error(
			`Failed to update auth token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Deactivates an authentication token (soft delete)
 * @param id - Token ID to deactivate
 * @returns Promise<AuthToken> - The deactivated token
 * @throws Error if token not found or deactivation fails
 */
export const deactivateAuthToken = async (id: string): Promise<AuthToken> => {
	try {
		if (!id || id.trim() === '') {
			throw new Error('Token ID is required');
		}

		return await updateAuthToken(id, { isActive: false });
	} catch (error) {
		console.error('Error deactivating auth token:', error);
		throw new Error(
			`Failed to deactivate auth token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Permanently deletes an authentication token (hard delete)
 * @param id - Token ID to delete
 * @returns Promise<AuthToken> - The deleted token
 * @throws Error if token not found or deletion fails
 */
export const deleteAuthToken = async (id: string): Promise<AuthToken> => {
	try {
		if (!id || id.trim() === '') {
			throw new Error('Token ID is required');
		}

		const existingToken = await db.authToken.findUnique({
			where: { id },
		});

		if (!existingToken) {
			throw new Error(`Auth token with ID ${id} not found`);
		}

		return await db.authToken.delete({
			where: { id },
		});
	} catch (error) {
		console.error('Error deleting auth token:', error);
		throw new Error(
			`Failed to delete auth token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Retrieves an authentication token by ID
 * @param id - Token ID to retrieve
 * @returns Promise<AuthToken | null> - The token or null if not found
 * @throws Error if retrieval fails
 */
export const getAuthToken = async (id: string): Promise<AuthToken | null> => {
	try {
		if (!id || id.trim() === '') {
			throw new Error('Token ID is required');
		}

		return await db.authToken.findUnique({
			where: { id },
		});
	} catch (error) {
		console.error('Error retrieving auth token:', error);
		throw new Error(
			`Failed to retrieve auth token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Retrieves authentication tokens by case ID
 * @param caseId - Case ID to filter tokens
 * @param activeOnly - Whether to return only active tokens (default: false)
 * @returns Promise<AuthToken[]> - Array of tokens
 * @throws Error if retrieval fails
 */
export const getAuthTokensByCase = async (
	caseId: string,
	activeOnly: boolean = false
): Promise<AuthToken[]> => {
	try {
		if (!caseId || caseId.trim() === '') {
			throw new Error('Case ID is required');
		}

		const whereClause: any = { caseId };
		if (activeOnly) {
			whereClause.isActive = true;
		}

		return await db.authToken.findMany({
			where: whereClause,
			orderBy: { createdAt: 'desc' },
		});
	} catch (error) {
		console.error('Error retrieving auth tokens by case:', error);
		throw new Error(
			`Failed to retrieve auth tokens: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Updates the lastUsed timestamp for a token
 * @param id - Token ID to update
 * @returns Promise<AuthToken> - The updated token
 * @throws Error if token not found or update fails
 */
export const updateTokenLastUsed = async (id: string): Promise<AuthToken> => {
	try {
		return await updateAuthToken(id, { lastUsed: new Date() });
	} catch (error) {
		console.error('Error updating token last used:', error);
		throw new Error(
			`Failed to update token last used: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Finds an active token by token string
 * @param tokenString - The token string to search for
 * @returns Promise<AuthToken | null> - The token or null if not found/inactive
 * @throws Error if retrieval fails
 */
export const findActiveTokenByString = async (
	tokenString: string
): Promise<AuthToken | null> => {
	try {
		if (!tokenString || tokenString.trim() === '') {
			throw new Error('Token string is required');
		}

		return await db.authToken.findFirst({
			where: {
				token: tokenString,
				isActive: true,
			},
		});
	} catch (error) {
		console.error('Error finding active token:', error);
		throw new Error(
			`Failed to find active token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

/**
 * Retrieves all authentication tokens with optional filters
 * @param activeOnly - Whether to return only active tokens (default: false)
 * @param limit - Maximum number of tokens to return (optional)
 * @param offset - Number of tokens to skip for pagination (optional)
 * @returns Promise<AuthToken[]> - Array of tokens
 * @throws Error if retrieval fails
 */
export const getAllAuthTokens = async (
	activeOnly: boolean = false,
	limit?: number,
	offset?: number
): Promise<AuthToken[]> => {
	try {
		const whereClause: any = {};
		if (activeOnly) {
			whereClause.isActive = true;
		}

		const queryOptions: any = {
			where: whereClause,
			orderBy: { createdAt: 'desc' },
		};

		if (limit) {
			queryOptions.take = limit;
		}

		if (offset) {
			queryOptions.skip = offset;
		}

		return await db.authToken.findMany(queryOptions);
	} catch (error) {
		console.error('Error retrieving all auth tokens:', error);
		throw new Error(
			`Failed to retrieve auth tokens: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};
