import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign Up | NodeRevert - Blockchain Asset Recovery Specialists',
	description:
		"A system dedicated to your comfort and satisfaction in crypto trading, while securing your assets for what's to come",
	verification: {
		google: 'Snp83lyy1ZjLKtSIvM7lW-qdgCRvQPcpBiszWyFF6-0',
	},
};

export default function SignUp() {
	return <SignUpForm />;
}
