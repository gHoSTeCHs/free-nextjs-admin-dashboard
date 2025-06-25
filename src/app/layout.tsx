import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';

const outfit = Outfit({
	subsets: ['latin'],
});

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
