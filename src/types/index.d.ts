import { Case, RecoveryAsset } from '@/generated/prisma/client';

export interface CaseWithAssets extends Case {
	recoveryAssets: RecoveryAsset[];
}
