import { NextResponse } from 'next/server';
import { getPhrasesStats } from '@/actions/phrases';

export async function GET() {
	try {
		const stats = await getPhrasesStats();

		return NextResponse.json(stats, { status: 200 });
	} catch (error) {
		console.error('Error in phrases API route:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch phrases statistics',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
