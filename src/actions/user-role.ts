import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const checkUserRole = async () => {
	const session = await auth();

	if (!session) redirect('/signin');
	if (session?.user.role !== 'ADMIN') redirect('/');

	return;
};

export { checkUserRole };
