'use client';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="flex flex-col gap-5 items-center">
        <Image src={'/logo.png'} width={32} height={32} alt="tarello" />
        <Button onClick={() => signIn('github', { callbackUrl: '/org' })}>
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
