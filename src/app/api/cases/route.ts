import { getCases } from '@/actions/getCases';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const cases = await getCases();
		return NextResponse.json(cases);
	} catch (error) {
		console.error('Error fetching cases:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch cases' },
			{ status: 500 }
		);
	}
}
