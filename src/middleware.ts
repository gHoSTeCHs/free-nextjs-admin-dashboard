import { auth } from './auth'; // Import from your auth.ts file
import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	publicRoutes,
} from './routes';
import { USERROLE } from './generated/prisma/client';

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	const role = req.auth?.user?.role as USERROLE;

	// console.log('User role:', role);
	// console.log('Full user object:', req.auth?.user);

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return;
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL('/signin', nextUrl));
	}

	if (isLoggedIn && role) {
		if (nextUrl.pathname.startsWith('/admin') && role !== USERROLE.ADMIN) {
			return Response.redirect(new URL('/unauthorized', nextUrl));
		}
	}

	return;
});

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
