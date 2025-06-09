/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
	try {
		const user = db.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				name: true,
				password: true,
				role: true,
			},
		});

		return user;
	} catch (error) {
		return null;
	}
};
export const getUserById = async (id: string) => {
	try {
		const user = db.user.findUnique({
			where: { id },
			select: {
				id: true,
				role: true,
			},
		});

		return user;
	} catch (error) {
		return null;
	}
};
