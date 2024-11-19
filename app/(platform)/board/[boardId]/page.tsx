'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Board } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const BoardIdPage = () => {
  // const { boardId } = useParams();
  // const [board, setBoard] = useState<Board | undefined>(undefined);
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!boardId) {
  //     setError('Board ID is missing.');
  //     return;
  //   }

  //   async function getBoard() {
  //     setLoading(true);
  //     setError(null); // Reset error before fetching

  //     try {
  //       const response = await fetch(`/api/board/${boardId}`);
  //       if (!response.ok) {
  //         const errorDetails = await response.json();
  //         throw new Error(errorDetails.message || 'Failed to load board');
  //       }
  //       const boardData = await response.json();
  //       setBoard(boardData);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'An unknown error occurred');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   getBoard();
  // }, [boardId]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-5">
      <div className="w-72 bg-slate-300 p-2 rounded-sm shadow-sm">
        <Button variant="ghost" className="w-full justify-start h-8">
          <Plus />
          <span>Add another list</span>
        </Button>
      </div>
    </div>
  );
};

export default BoardIdPage;
