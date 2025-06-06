import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id:string
	role: "ADMIN" | "USER"
}

declare module "next-auth" {
	interface Session {
		user: ExtendedUser
  }
  interface User {
    role: "ADMIN" | "USER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER"
  }
}