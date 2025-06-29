import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In | NodeRevert - Professional Crypto Recovery Services',
	description:
		"A system dedicated to your comfort and satisfaction in crypto trading, while securing your assets for what's to come",
	verification: {
		google: 'Snp83lyy1ZjLKtSIvM7lW-qdgCRvQPcpBiszWyFF6-0',
	},
};

export default function SignIn() {
	return <SignInForm />;
}
