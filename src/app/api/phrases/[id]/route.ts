import { NextResponse } from 'next/server';
import { getPhraseById } from '@/actions/phrases';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const phrase = await getPhraseById(id);

		if (!phrase) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		return NextResponse.json(phrase, { status: 200 });
	} catch (error) {
		console.error('Error in phrase API route:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch phrase' },
			{ status: 500 }
		);
	}
}
