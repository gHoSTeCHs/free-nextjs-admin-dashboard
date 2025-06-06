
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  session?: Session;
}

export default function AuthSessionProvider({ children, session }: Props) {
  return <SessionProvider session={session}
    refetchInterval={5 * 60}
    refetchOnWindowFocus={true}
      refetchWhenOffline={false}
  >{children}</SessionProvider>;
}