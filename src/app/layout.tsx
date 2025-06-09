import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

const outfit = Outfit({
	subsets: ['latin'],
});

export default async function RootLayout({
	children,
	session,
}: Readonly<{
	children: React.ReactNode;
	session: Session | null;
}>) {
	return (
		<html lang="en">
			<body className={`${outfit.className} dark:bg-gray-900`}>
				<ThemeProvider>
					<SessionProvider session={session}>
						<SidebarProvider>{children}</SidebarProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
