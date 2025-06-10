import { Case, RecoveryAsset } from '@/generated/prisma/client';

export interface CaseWithAssets extends Case {
	recoveryAssets: RecoveryAsset[];
}

export interface AuthToken {
	id: string;
	token: string;
	caseId: string;
	caseTitle: string;
	createdAt: string;
	lastUsed?: string;
	isActive: boolean;
}

export interface Case {
	id: string;
	title: string;
}
