import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { Metadata } from 'next';

const outfit = Outfit({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	verification: {
		google: 'Snp83lyy1ZjLKtSIvM7lW-qdgCRvQPcpBiszWyFF6-0',
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${outfit.className} dark:bg-gray-900`}>
				<ThemeProvider>
					<SessionProvider>
						<NextTopLoader />
						<SidebarProvider>{children}</SidebarProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
