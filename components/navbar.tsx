'use client';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import Image from 'next/image';

export const Navbar = () => {
  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="flex flex-col gap-5 items-center">
        <div className="inline-flex gap-2 items-center">
          <Image src={'/logo.png'} width={32} height={32} alt="tarello" />
          <p>Trello clone</p>
        </div>
        <Button onClick={() => signIn('github', { callbackUrl: '/org' })}>
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
};
