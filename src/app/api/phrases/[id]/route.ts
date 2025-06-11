import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

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

		if (!phrase) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		return NextResponse.json(phrase);
	} catch (error) {
		console.error('Error fetching phrase:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch phrase' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Check if phrase exists
		const existingPhrase = await db.phrase.findUnique({
			where: { id },
		});

		if (!existingPhrase) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		// Delete the phrase
		await db.phrase.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: 'Phrase deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting phrase:', error);
		return NextResponse.json(
			{ error: 'Failed to delete phrase' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const body = await request.json();
		const { walletType, phrase } = body;

		// Check if phrase exists
		const existingPhrase = await db.phrase.findUnique({
			where: { id },
		});

		if (!existingPhrase) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		// Update the phrase
		const updatedPhrase = await db.phrase.update({
			where: { id },
			data: {
				...(walletType && { walletType }),
				...(phrase && { phrase }),
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

		return NextResponse.json(updatedPhrase);
	} catch (error) {
		console.error('Error updating phrase:', error);
		return NextResponse.json(
			{ error: 'Failed to update phrase' },
			{ status: 500 }
		);
	}
}
