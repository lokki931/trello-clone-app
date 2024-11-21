'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Organization } from '@prisma/client';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
interface HeadersProps {
  orgId: string;
}
export function Headers({ orgId }: HeadersProps) {
  const [organization, setOrganization] = useState<Organization>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/organization/${orgId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast(`Error deleting org: ${errorData}`);
        return;
      }

      const data = await response.json();

      toast(data?.message);
      setTimeout(() => {
        router.push(`/org`);
      }, 1000);
    } catch (error) {
      console.error('Error making DELETE request:', error);
    }
  };

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <img src={organization?.img} alt={organization?.title} className="w-8 h-8" />
        <p>{organization?.title}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="hover:bg-white cursor-pointer rounded-sm" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            Delete Workspase
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
