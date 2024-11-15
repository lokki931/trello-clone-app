'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { Organization } from '@prisma/client';
import { useState, useEffect } from 'react';
interface HeadersProps {
  orgId: string;
}
export function Headers({ orgId }: HeadersProps) {
  const [organization, setOrganization] = useState<Organization>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getOrganization() {
      try {
        setLoading(true);
        const data = await fetch(`/api/organization/${orgId}`);
        if (!data.ok) {
          const errorDetails = await data.json();
          throw new Error(errorDetails.message || 'Failed to load organization');
        }
        const organizationData = await data.json();
        setOrganization(organizationData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getOrganization();
  }, [orgId]);

  if (loading)
    return (
      <div>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <img src={organization?.img} alt={organization?.title} className="w-8 h-8" />
        <p>{organization?.title}</p>
      </div>
    </div>
  );
}
