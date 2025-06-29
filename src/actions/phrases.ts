'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface PhraseWithUser {
	id: string;
	wType: string;
	phrase: string;
	userId: string;
	createdAt: Date;
	user: {
		id: string;
		name: string | null;
		email: string | null;
	};
}

export interface PhrasesStatsResponse {
	totalPhrases: number;
	phrasesThisMonth: number;
	wTypeDistribution: Array<{
		wType: string;
		count: number;
	}>;
	recentPhrases: Array<{
		id: string;
		wType: string;
		createdAt: string;
		user: {
			name: string | null;
			email: string | null;
		};
	}>;
}

export async function getAllPhrases(): Promise<PhraseWithUser[]> {
	try {
		const phrases = await db.phrase.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return phrases;
	} catch (error) {
		console.error('Error fetching phrases:', error);
		throw new Error('Failed to fetch phrases');
	}
}

export async function getPhraseById(
	id: string
): Promise<PhraseWithUser | null> {
	try {
		const phrase = await db.phrase.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		return phrase;
	} catch (error) {
		console.error('Error fetching phrase:', error);
		throw new Error('Failed to fetch phrase');
	}
}

export async function createPhrase(data: {
	wType: string;
	phrase: string;
	userId: string;
}): Promise<PhraseWithUser> {
	try {
		const newPhrase = await db.phrase.create({
			data: {
				wType: data.wType,
				phrase: data.phrase,
				userId: data.userId,
				createdAt: new Date(),
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		revalidatePath('/phrases');
		return newPhrase;
	} catch (error) {
		console.error('Error creating phrase:', error);
		throw new Error('Failed to create phrase');
	}
}

export async function deletePhrase(id: string): Promise<boolean> {
	try {
		// Check if phrase exists
		const existingPhrase = await db.phrase.findUnique({
			where: { id },
		});

		if (!existingPhrase) {
			throw new Error('Phrase not found');
		}

		// Delete the phrase
		await db.phrase.delete({
			where: { id },
		});

		revalidatePath('/phrases');
		return true;
	} catch (error) {
		console.error('Error deleting phrase:', error);
		throw new Error('Failed to delete phrase');
	}
}

export async function updatePhrase(
	id: string,
	data: {
		wType?: string;
		phrase?: string;
	}
): Promise<PhraseWithUser> {
	try {
		// Check if phrase exists
		const existingPhrase = await db.phrase.findUnique({
			where: { id },
		});

		if (!existingPhrase) {
			throw new Error('Phrase not found');
		}

		// Update the phrase
		const updatedPhrase = await db.phrase.update({
			where: { id },
			data: {
				...(data.wType && { wType: data.wType }),
				...(data.phrase && { phrase: data.phrase }),
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		revalidatePath('/phrases');
		return updatedPhrase;
	} catch (error) {
		console.error('Error updating phrase:', error);
		throw new Error('Failed to update phrase');
	}
}

export async function searchPhrases(
	searchTerm: string
): Promise<PhraseWithUser[]> {
	try {
		const phrases = await db.phrase.findMany({
			where: {
				OR: [
					{
						wType: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						user: {
							OR: [
								{
									name: {
										contains: searchTerm,
										mode: 'insensitive',
									},
								},
								{
									email: {
										contains: searchTerm,
										mode: 'insensitive',
									},
								},
							],
						},
					},
				],
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return phrases;
	} catch (error) {
		console.error('Error searching phrases:', error);
		throw new Error('Failed to search phrases');
	}
}

export async function getPhrasesByUserId(
	userId: string
): Promise<PhraseWithUser[]> {
	try {
		const phrases = await db.phrase.findMany({
			where: {
				userId,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return phrases;
	} catch (error) {
		console.error('Error fetching user phrases:', error);
		throw new Error('Failed to fetch user phrases');
	}
}

export async function getPhrasesStats(): Promise<PhrasesStatsResponse> {
	try {
		const [totalPhrases, phrasesThisMonth, wTypeDistribution, recentPhrases] =
			await Promise.all([
				db.phrase.count(),
				db.phrase.count({
					where: {
						createdAt: {
							gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
						},
					},
				}),
				db.phrase.groupBy({
					by: ['wType'],
					_count: {
						id: true,
					},
					orderBy: {
						_count: {
							id: 'desc',
						},
					},
				}),
				db.phrase.findMany({
					take: 5,
					orderBy: {
						createdAt: 'desc',
					},
					include: {
						user: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				}),
			]);

		return {
			totalPhrases,
			phrasesThisMonth,
			wTypeDistribution: wTypeDistribution.map((item) => ({
				wType: item.wType,
				count: item._count.id,
			})),
			recentPhrases: recentPhrases.map((phrase) => ({
				id: phrase.id,
				wType: phrase.wType,
				createdAt: phrase.createdAt.toISOString(),
				user: {
					name: phrase.user.name,
					email: phrase.user.email,
				},
			})),
		};
	} catch (error) {
		console.error('Error fetching phrases stats:', error);
		throw new Error('Failed to fetch phrases statistics');
	}
}
