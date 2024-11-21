'use client';
import { useParams } from 'next/navigation';
import { Headers } from './_components/Headers';

export default function LayoutOrgId({ children }: { children: React.ReactNode }) {
  const { orgId } = useParams();

  return (
    <div className="mt-5">
      <Headers orgId={orgId as string} />
      {children}
    </div>
  );
}
