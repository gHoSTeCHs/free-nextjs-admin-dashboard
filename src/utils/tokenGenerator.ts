import { randomBytes } from 'crypto';

export function generateSecureToken(length: number = 32): string {
	const bytes = randomBytes(Math.ceil((length * 3) / 4));

	const base64 = bytes
		.toString('base64')
		.replace(/[+/]/g, '')
		.replace(/=+$/, '');

	return base64.slice(0, length);
}
