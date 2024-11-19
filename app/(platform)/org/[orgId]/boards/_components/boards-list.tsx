'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Board } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

interface BoardsListProps {
  orgId: string;
}

export const BoardsList = ({ orgId }: BoardsListProps) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(`/api/board?organizationId=${encodeURIComponent(orgId)}`);
        if (!response.ok) throw new Error('Failed to fetch boards');
        const data: Board[] = await response.json();
        setBoards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [orgId]);

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      {boards.map((board) => (
        <div
          key={board.id}
          className="h-36 flex items-center justify-center  rounded-sm shadow-sm cursor-pointer transition bg-center bg-cover relative hover:opacity-75"
          style={{ backgroundImage: `url(${board.imgThumb})` }}
          onClick={() => router.push(`/board/${board.id}`)}>
          <span className="text-white z-10">{board.title}</span>
          <div className="w-full h-full absolute left-0 right-0 bg-slate-500/50" />
        </div>
      ))}
    </>
  );
};
