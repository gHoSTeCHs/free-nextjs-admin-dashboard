import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign Up | NodeRevert - Blockchain Asset Recovery Specialists',
	description:
		'Create your NodeRevert account to access expert crypto recovery services. Start your digital asset restoration journey with our secure registration process.',
};

export default function SignUp() {
	return <SignUpForm />;
}
