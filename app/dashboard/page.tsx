'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === 'unauthenticated') router.push('/signin'); // Redirect if not authenticated
  // }, [status]);

  // if (status === 'loading') return <p>Loading...</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome, {'User'}</h1>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{ padding: '10px 20px', fontSize: '16px' }}>
        Sign out
      </button>
    </div>
  );
}
