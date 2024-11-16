'use client';
import { useParams } from 'next/navigation';
import { Headers } from '../_components/Headers';
import { CreateBoard } from './_components/create-board';

const OrgBoardPage = () => {
  const params = useParams();
  return (
    <div className="mt-5">
      <Headers orgId={params.orgId as string} />
      <div className="mt-4">
        <CreateBoard orgId={params.orgId as string}>
          <div className="w-36 h-20 flex items-center justify-center text-cyan-50 bg-slate-800 hover:bg-white hover:text-black rounded-sm shadow-sm cursor-pointer transition">
            Create Board
          </div>
        </CreateBoard>
      </div>
    </div>
  );
};

export default OrgBoardPage;
