'use server';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schema';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/data/user';

export async function register(values: z.infer<typeof RegisterSchema>) {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'Something went wrong..',
		};
	}

	const { name, email, password } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const userWithSameEmail = await getUserByEmail(email);

	if (userWithSameEmail) {
		return {
			error: 'Email already exists..',
		};
	}
	await db.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	return {
		success: 'User created',
	};
}
