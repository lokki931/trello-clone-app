'use client';
import { useParams } from 'next/navigation';
import { CreateBoard } from './_components/create-board';
import { BoardsList } from './_components/boards-list';

const OrgBoardPage = () => {
  const params = useParams();

  return (
    <div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        <BoardsList orgId={params.orgId as string} />
        <CreateBoard orgId={params.orgId as string}>
          <div className="h-36 flex items-center justify-center text-cyan-50 bg-slate-800 hover:bg-white hover:text-black rounded-sm shadow-sm cursor-pointer transition">
            Create Board
          </div>
        </CreateBoard>
      </div>
    </div>
  );
};

export default OrgBoardPage;
