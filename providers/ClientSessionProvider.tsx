'use client';
import { SessionProvider } from 'next-auth/react';

const ClientSessionProvider = ({ children, session }: any) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default ClientSessionProvider;
