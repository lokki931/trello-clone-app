'use client';

import { Organization } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Activity, LayoutGrid, Plus } from 'lucide-react';

export const SideBar = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { orgId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organization');
        if (!response.ok) throw new Error('Failed to fetch organizations');
        const data: Organization[] = await response.json();
        setOrganizations(data);
        if (data.length > 0 && orgId) setOpenItems([orgId as string]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [orgId]);

  const navigate = (path: string, orgId: string) => {
    setOpenItems([orgId]);
    router.push(path);
  };

  const handleAccordionToggle = (id: string) => {
    setOpenItems(
      (prevOpenItems) =>
        prevOpenItems.includes(id)
          ? prevOpenItems.filter((item) => item !== id) // Close the item
          : [...prevOpenItems, id], // Open the item
    );
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-5">
      <Button
        variant="ghost"
        onClick={() => router.push('/org')}
        className="w-full flex justify-between gap-2 mb-2">
        <span>Workspace</span>
        <Plus />
      </Button>
      {organizations.length === 0 ? (
        <p>No organizations found</p>
      ) : (
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full px-4">
          {organizations.map((org) => (
            <AccordionItem key={org.id} value={org.id}>
              <AccordionTrigger onClick={() => handleAccordionToggle(org.id)}>
                <img
                  src={org.img}
                  alt={org.title || 'Organization image'}
                  className="w-6 h-6 rounded-full mr-2"
                />
                {org.title || 'Untitled Organization'}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pl-10 flex flex-col gap-2">
                  <li
                    onClick={() => navigate(`/org/${org.id}/boards`, org.id)}
                    className={cn(
                      'flex gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded',
                      pathname === `/org/${org.id}/boards` ? 'bg-gray-100' : '',
                    )}>
                    <LayoutGrid className="w-6 h-6" />
                    <span>Boards</span>
                  </li>
                  <li
                    onClick={() => navigate(`/org/${org.id}/activities`, org.id)}
                    className={cn(
                      'flex gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded',
                      pathname === `/org/${org.id}/activities` ? 'bg-gray-100' : '',
                    )}>
                    <Activity className="w-6 h-6" />
                    <span>Activities</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
