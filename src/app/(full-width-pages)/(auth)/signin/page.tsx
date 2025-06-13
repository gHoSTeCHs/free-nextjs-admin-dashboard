import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In | NodeRevert - Professional Crypto Recovery Services',
	description:
		"Log into NodeRevert's secure platform to initiate crypto asset recovery, track investigation progress, and access your digital asset restoration dashboard.",
};

export default function SignIn() {
	return <SignInForm />;
}
