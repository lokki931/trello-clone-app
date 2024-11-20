'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Board } from '@prisma/client';
import { SideBar } from '../../_components/side-bar';
import { BoardHeader } from './_components/board-header';
import { BoardOption } from './_components/board-option';
import { Kanban } from 'lucide-react';

const BoardIdlayout = ({ children }: { children: React.ReactNode }) => {
  const { boardId } = useParams();
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!boardId) {
      setError('Board ID is missing.');
      return;
    }

    async function getBoard() {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const response = await fetch(`/api/board/${boardId}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message || 'Failed to load board');
        }
        const boardData = await response.json();
        setBoard(boardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    getBoard();
  }, [boardId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100%-4.5rem)] bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div
      className="bg-cover bg-center min-h-[calc(100%-4.5rem)]"
      style={{ backgroundImage: `url(${board?.imgFull})` }}>
      <main className="grid grid-areas-layout grid-cols-layout grid-rows-layout h-full px-4 max-w-screen-2xl mx-auto">
        <div className="grid-in-bar bg-slate-500 p-5 ">
          <SideBar />
        </div>
        <div className="grid-in-content ml-5">{children}</div>
        <div className="grid-in-title bg-slate-500/50 p-5 flex gap-2 justify-between items-center">
          {board && <BoardHeader data={board} />}
          <div className="mr-auto inline-flex items-center bg-slate-100 p-1 rounded-sm">
            <Kanban />
            <span className="font-mono text-sm">Board</span>
          </div>
          {board && <BoardOption id={board.id} orgId={board.organizationId} />}
        </div>
      </main>
    </div>
  );
};

export default BoardIdlayout;
