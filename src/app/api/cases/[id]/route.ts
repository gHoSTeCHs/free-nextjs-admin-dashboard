import { getCaseById } from '@/actions/getCases';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const singleCase = await getCaseById(params.id);

		if (!singleCase) {
			return NextResponse.json({ error: 'Case not found' }, { status: 404 });
		}

		return NextResponse.json(singleCase);
	} catch (error) {
		console.error('Error fetching case:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch case' },
			{ status: 500 }
		);
	}
}
