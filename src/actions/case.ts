'use server';
import { Case, RecoveryAsset } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface CreateCaseValues {
	case: Case;
	assets: RecoveryAsset[];
}

interface UpdateCaseValues {
	case: Case;
	assets: RecoveryAsset[];
	deletedAssetIds?: string[];
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
								wallet: asset.wall,
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
							wall: asset.wall,
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

export async function updateCase(values: UpdateCaseValues) {
	try {
		if (!values.case.id) {
			throw new Error('Case ID is required for updating');
		}

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

		const existingCase = await db.case.findUnique({
			where: { id: values.case.id },
			include: { recoveryAssets: true },
		});

		if (!existingCase) {
			throw new Error('Case not found');
		}

		const result = await retryOperation(async () => {
			try {
				return await db.$transaction(
					async (tx) => {
						const updatedCase = await tx.case.update({
							where: { id: values.case.id },
							data: {
								title: values.case.title,
								status: values.case.status,
								assetsToRecover: values.case.assetsToRecover,
								totalValue: Number(values.case.totalValue),
								lastKnownValue: Number(values.case.lastKnownValue),
								recoveryMethods: values.case.recoveryMethods,
								lastUpdated: new Date(),
								priority: values.case.priority,
							},
						});

						if (values.deletedAssetIds && values.deletedAssetIds.length > 0) {
							await tx.recoveryAsset.deleteMany({
								where: {
									id: { in: values.deletedAssetIds },
									case_id: values.case.id,
								},
							});
						}

						const existingAssets = values.assets.filter((asset) =>
							existingCase.recoveryAssets.some(
								(existing) => existing.id === asset.id
							)
						);

						const newAssets = values.assets.filter(
							(asset) =>
								!existingCase.recoveryAssets.some(
									(existing) => existing.id === asset.id
								)
						);

						for (const asset of existingAssets) {
							await tx.recoveryAsset.update({
								where: { id: asset.id },
								data: {
									asset: asset.asset,
									symbol: asset.symbol,
									amount: Number(asset.amount),
									currentValue: Number(asset.currentValue),
									lastKnownPrice: Number(asset.lastKnownPrice),
									wall: asset.wall,
									lastAccessed: new Date(asset.lastAccessed),
									status: asset.status,
								},
							});
						}

						let newAssetsCreated = 0;
						if (newAssets.length > 0) {
							const createResult = await tx.recoveryAsset.createMany({
								data: newAssets.map((asset) => ({
									id: asset.id,
									case_id: values.case.id,
									asset: asset.asset,
									symbol: asset.symbol,
									amount: Number(asset.amount),
									currentValue: Number(asset.currentValue),
									lastKnownPrice: Number(asset.lastKnownPrice),
									wallet: asset.wall,
									lastAccessed: new Date(asset.lastAccessed),
									status: asset.status,
								})),
							});
							newAssetsCreated = createResult.count;
						}

						return {
							case: updatedCase,
							existingAssetsUpdated: existingAssets.length,
							newAssetsCreated,
							assetsDeleted: values.deletedAssetIds?.length || 0,
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

				const updatedCase = await db.case.update({
					where: { id: values.case.id },
					data: {
						title: values.case.title,
						status: values.case.status,
						assetsToRecover: values.case.assetsToRecover,
						totalValue: Number(values.case.totalValue),
						lastKnownValue: Number(values.case.lastKnownValue),
						recoveryMethods: values.case.recoveryMethods,
						lastUpdated: new Date(),
						priority: values.case.priority,
					},
				});

				let assetsDeleted = 0;
				if (values.deletedAssetIds && values.deletedAssetIds.length > 0) {
					const deleteResult = await db.recoveryAsset.deleteMany({
						where: {
							id: { in: values.deletedAssetIds },
							case_id: values.case.id,
						},
					});
					assetsDeleted = deleteResult.count;
				}

				const existingAssets = values.assets.filter((asset) =>
					existingCase.recoveryAssets.some(
						(existing) => existing.id === asset.id
					)
				);

				const newAssets = values.assets.filter(
					(asset) =>
						!existingCase.recoveryAssets.some(
							(existing) => existing.id === asset.id
						)
				);

				for (const asset of existingAssets) {
					await db.recoveryAsset.update({
						where: { id: asset.id },
						data: {
							asset: asset.asset,
							symbol: asset.symbol,
							amount: Number(asset.amount),
							currentValue: Number(asset.currentValue),
							lastKnownPrice: Number(asset.lastKnownPrice),
							wall: asset.wall,
							lastAccessed: new Date(asset.lastAccessed),
							status: asset.status,
						},
					});
				}

				const createdAssets = [];
				for (const asset of newAssets) {
					const createdAsset = await db.recoveryAsset.create({
						data: {
							id: asset.id,
							case_id: values.case.id,
							asset: asset.asset,
							symbol: asset.symbol,
							amount: Number(asset.amount),
							currentValue: Number(asset.currentValue),
							lastKnownPrice: Number(asset.lastKnownPrice),
							wall: asset.wall,
							lastAccessed: new Date(asset.lastAccessed),
							status: asset.status,
						},
					});
					createdAssets.push(createdAsset);
				}

				return {
					case: updatedCase,
					existingAssetsUpdated: existingAssets.length,
					newAssetsCreated: createdAssets.length,
					assetsDeleted,
				};
			}
		});

		revalidatePath('/admincases');

		const totalChanges =
			result.existingAssetsUpdated +
			result.newAssetsCreated +
			result.assetsDeleted;
		let message = 'Case updated successfully';

		if (totalChanges > 0) {
			const changes = [];
			if (result.existingAssetsUpdated > 0) {
				changes.push(`${result.existingAssetsUpdated} asset(s) updated`);
			}
			if (result.newAssetsCreated > 0) {
				changes.push(`${result.newAssetsCreated} asset(s) added`);
			}
			if (result.assetsDeleted > 0) {
				changes.push(`${result.assetsDeleted} asset(s) removed`);
			}
			message += ` with ${changes.join(', ')}`;
		}

		return {
			success: true,
			data: result,
			message,
		};
	} catch (error) {
		console.error('Error updating case:', error);

		let errorMessage = 'Failed to update case. Please try again.';

		if (error instanceof Error) {
			if (error.message.includes('not found')) {
				errorMessage =
					'Case not found. It may have been deleted by another user.';
			} else if (error.message.includes('Unique constraint')) {
				errorMessage =
					'A conflict occurred while updating. Please refresh and try again.';
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
