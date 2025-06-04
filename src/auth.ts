import NextAuth from "next-auth";
import authConfig from "./authConfig";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./data/user";
import { db } from "./lib/db";
export const {
	auth, handlers, signIn, signOut,
} = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(db),
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);
			if (!existingUser) return token;

			token.role = existingUser.role;
			return token;
		}
	}
})

export const { GET, POST } = handlers;