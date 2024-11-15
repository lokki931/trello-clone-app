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
import { Skeleton } from '@/components/ui/skeleton';

export const NavbarPlatform = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    // Render skeleton placeholders while session data is loading
    return (
      <div className="flex items-center p-4 justify-between gap-x-2 max-w-screen-2xl mx-auto bg-slate-900">
        <Skeleton className="h-8 w-8 rounded-full" /> {/* Skeleton for Avatar */}
        <Skeleton className="h-8 w-8 rounded-full" /> {/* Skeleton for Dropdown */}
      </div>
    );
  }

  if (!session) return null; // Handle cases where user is not logged in

  const userImage = session.user?.image ?? undefined;
  const userName = session.user?.name ?? 'Unknown User';
  const userInitials = userName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center p-4 justify-between gap-x-2 max-w-screen-2xl mx-auto bg-slate-900">
      <Image src="/logo.png" width={32} height={32} alt="tarello logo" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label={`${userName}'s menu`}>
          <Avatar>
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <span className="font-medium">{userName}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            <span className="text-red-500">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
