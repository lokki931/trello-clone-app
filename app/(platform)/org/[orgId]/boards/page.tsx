'use client';
import { useParams } from 'next/navigation';
import { Headers } from '../_components/Headers';
const OrgBoardPage = () => {
  const params = useParams();
  return (
    <div className="mt-5">
      <Headers orgId={params.orgId as string} />
    </div>
  );
};

export default OrgBoardPage;
