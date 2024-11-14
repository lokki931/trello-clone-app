'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const NavbarPlatform = () => {
  const { data: session } = useSession();

  if (!session) return null; // Handle cases where user is not logged in

  return (
    <div className="flex items-center p-4 justify-between gap-x-2 max-w-screen-2xl mx-auto">
      <Image src="/logo.png" width={32} height={32} alt="tarello" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="User menu">
          <Avatar>
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? 'User avatar'}
            />
            <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() ?? 'CN'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>{session.user.name ?? 'Unknown User'}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
