'use server';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schema';
import * as z from 'zod';
import { AuthError } from 'next-auth';

export async function login(values: z.infer<typeof LoginSchema>) {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'Something went wrong..',
		};
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CallbackRouteError':
					return {
						error: 'Something went wrong..',
					};
				case 'CredentialsSignin':
					return {
						error: 'Invalid credentials!',
					};
				default:
					return {
						error: 'Something went wrong..',
					};
			}
		}

		throw error;
	}
}
