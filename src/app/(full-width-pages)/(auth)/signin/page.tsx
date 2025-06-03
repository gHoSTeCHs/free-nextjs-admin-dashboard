import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | NodeRevert - Next.js Dashboard Template",
  description: "This is Next.js Signin Page NodeRevert Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
