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
