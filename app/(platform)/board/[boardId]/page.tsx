'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { List } from '@prisma/client';
import { ListCreate } from './_components/list-create';

const BoardIdPage = () => {
  const { boardId } = useParams();
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    if (!boardId) {
      console.log('Board ID is missing.');
      return;
    }

    async function getLists() {
      try {
        const response = await fetch(`/api/list?boardId=${encodeURIComponent(boardId as string)}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          console.log(errorDetails.message || 'Failed to load board');
        }
        const ListsData = await response.json();
        setLists(ListsData);
      } catch (err) {
        console.log(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }

    getLists();
  }, [boardId]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-5">
      {lists?.map((list) => (
        <p key={list.id}>{list.title}</p>
      ))}
      <ListCreate id={boardId as string} setData={setLists} />
    </div>
  );
};

export default BoardIdPage;
