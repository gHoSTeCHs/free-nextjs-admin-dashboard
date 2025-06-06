"use server"
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function  AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/signin')
  if (session?.user.role !== 'ADMIN') redirect('/')

  return (
    <div>{children}</div>
  )
}