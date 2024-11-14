'use client';
import { signIn, signOut } from 'next-auth/react';

export default function SignIn() {
  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={() => signIn('github', { callbackUrl: '/org' })}>Sign in with GitHub</button>
    </div>
  );
}
