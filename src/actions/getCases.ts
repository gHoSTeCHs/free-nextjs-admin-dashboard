import { db } from '@/lib/db';

export const getCases = async () => {
	try {
		const cases = await db.case.findMany({
			orderBy: {
				createdDate: 'desc',
			},
			include: {
				recoveryAssets: true,
			},
		});
		return cases;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getCaseById = async (id: string) => {
	try {
		const singleCase = await db.case.findUnique({
			where: {
				id: id,
			},
			include: {
				recoveryAssets: true,
			},
		});
		return singleCase;
	} catch (error) {
		console.log(error);
		return null;
	}
};
