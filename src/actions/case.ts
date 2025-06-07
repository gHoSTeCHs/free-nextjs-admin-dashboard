'use server';
import { Case, RecoveryAsset } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface CreateCaseValues {
	case: Case;
	assets: RecoveryAsset[];
}

async function retryOperation<T>(
	operation: () => Promise<T>,
	maxRetries: number = 3,
	delay: number = 1000
): Promise<T> {
	let lastError: Error;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error as Error;
			console.warn(`Attempt ${attempt} failed:`, error);

			if (attempt < maxRetries) {
				await new Promise((resolve) => setTimeout(resolve, delay * attempt));
			}
		}
	}

	throw lastError!;
}

export async function createCase(values: CreateCaseValues) {
	try {
		if (!values.case.title.trim()) {
			throw new Error('Case title is required');
		}

		if (!values.assets || values.assets.length === 0) {
			throw new Error('At least one recovery asset is required');
		}

		for (const asset of values.assets) {
			if (!asset.asset.trim() || !asset.symbol.trim()) {
				throw new Error('All assets must have a name and symbol');
			}
			if (asset.amount <= 0) {
				throw new Error('Asset amounts must be greater than 0');
			}
		}

		const result = await retryOperation(async () => {
			try {
				return await db.$transaction(
					async (tx) => {
						const newCase = await tx.case.create({
							data: {
								id: values.case.id,
								title: values.case.title,
								status: values.case.status,
								assetsToRecover: values.case.assetsToRecover,
								totalValue: values.case.totalValue,
								lastKnownValue: values.case.lastKnownValue,
								recoveryMethods: values.case.recoveryMethods,
								createdDate: values.case.createdDate,
								lastUpdated: values.case.lastUpdated,
								priority: values.case.priority,
							},
						});

						const recoveryAssets = await tx.recoveryAsset.createMany({
							data: values.assets.map((asset) => ({
								id: asset.id,
								case_id: newCase.id,
								asset: asset.asset,
								symbol: asset.symbol,
								amount: asset.amount,
								currentValue: asset.currentValue,
								lastKnownPrice: asset.lastKnownPrice,
								wallet: asset.wallet,
								lastAccessed: asset.lastAccessed,
								status: asset.status,
							})),
						});

						return {
							case: newCase,
							assetsCreated: recoveryAssets.count,
						};
					},
					{
						timeout: 10000,
					}
				);
			} catch (transactionError) {
				console.warn(
					'Transaction failed, trying individual operations:',
					transactionError
				);

				const newCase = await db.case.create({
					data: {
						id: values.case.id,
						title: values.case.title,
						status: values.case.status,
						assetsToRecover: values.case.assetsToRecover,
						totalValue: Number(values.case.totalValue),
						lastKnownValue: values.case.lastKnownValue,
						recoveryMethods: values.case.recoveryMethods,
						createdDate: values.case.createdDate,
						lastUpdated: values.case.lastUpdated,
						priority: values.case.priority,
					},
				});

				const createdAssets = [];
				for (const asset of values.assets) {
					const createdAsset = await db.recoveryAsset.create({
						data: {
							id: asset.id,
							case_id: newCase.id,
							asset: asset.asset,
							symbol: asset.symbol,
							amount: asset.amount,
							currentValue: asset.currentValue,
							lastKnownPrice: asset.lastKnownPrice,
							wallet: asset.wallet,
							lastAccessed: asset.lastAccessed,
							status: asset.status,
						},
					});
					createdAssets.push(createdAsset);
				}

				return {
					case: newCase,
					assetsCreated: createdAssets.length,
				};
			}
		});

		revalidatePath('/admincases');

		return {
			success: true,
			data: result,
			message: `Case created successfully with ${result.assetsCreated} recovery assets`,
		};
	} catch (error) {
		console.error('Error creating case:', error);

		let errorMessage = 'Failed to create case. Please try again.';

		if (error instanceof Error) {
			if (error.message.includes('Unique constraint')) {
				errorMessage =
					'A case with this ID already exists. Please refresh and try again.';
			} else if (
				error.message.includes('timeout') ||
				error.message.includes('transaction')
			) {
				errorMessage =
					'Database connection timeout. Please check your connection and try again.';
			} else {
				errorMessage = error.message;
			}
		}

		return {
			success: false,
			error: errorMessage,
		};
	}
}
