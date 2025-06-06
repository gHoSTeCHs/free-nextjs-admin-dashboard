/**
 * An array of public routes that are allowed to be accessed without authentication.
 * These routes will redirect logged-in users to /settings.
 * @type {string[]}
 */

export const publicRoutes: string[] = [''];

/**
 * An array of routes used for authentication.
 * These routes will redirect logged-in users to /settings.
 * @type {string[]}
 */
export const authRoutes: string[] = ['/signin','/signup'];

/**
 * The prefix used for API authentication routes.
 * The routes that start with this prefix are used for auth purposes
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/';

/**   
 * These are the routes that are only accessible if the user is an admin 
 * @type {string[]} 
*/
export const adminRoutes: string[] = ['/admin/dashboard', '/admin/users', '/admin/settings', '/admin/analytics']; 