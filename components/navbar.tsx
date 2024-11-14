'use client';
import { signIn } from 'next-auth/react';

export const Navbar = () => {
  return (
    <div>
      <button onClick={() => signIn('github', { callbackUrl: '/org' })}>Sign in with GitHub</button>
    </div>
  );
};
