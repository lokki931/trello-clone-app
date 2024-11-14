'use client';
import { Organization } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import { Activity, LayoutGrid, Plus } from 'lucide-react';

export const SideBar = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { orgId } = useParams();
  const router = useRouter();
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organization');
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data: Organization[] = await response.json();
        setOrganizations(data);
        if (data.length > 0 && orgId) {
          setOpenItems([orgId as string]);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchOrganizations();
  }, []);
  if (error) {
    return <p>Error: {error}</p>;
  }
  const handleAccordionToggle = (id: string) => {
    setOpenItems((prevOpenItems) => {
      if (prevOpenItems.includes(id)) {
        return prevOpenItems.filter((item) => item !== id); // Close the item if already open
      } else {
        return [...prevOpenItems, id]; // Open the item if it is not already open
      }
    });
  };
  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => router.push('/org')}
        className="w-full flex justify-between gap-2">
        <span>workspase</span>
        <Plus />
      </Button>
      {organizations.length === 0 ? (
        <p>No organizations found</p>
      ) : (
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full">
          {organizations.map((org) => (
            <AccordionItem key={org.id} value={org.id}>
              <AccordionTrigger onClick={() => handleAccordionToggle(org.id)}>
                <img src={org.img} alt={org.title} />
                {org.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pl-10 flex flex-col gap-2">
                  <li
                    onClick={() => {
                      setOpenItems([org.id]);
                      router.push(`/org/${org.id}/boards`);
                    }}
                    className="flex gap-3 p-2">
                    <LayoutGrid />
                    <span>Boards</span>
                  </li>
                  <li
                    onClick={() => {
                      setOpenItems([org.id]);
                      router.push(`/org/${org.id}/activities`);
                    }}
                    className="flex gap-3 p-2">
                    <Activity />
                    <span>Activites</span>
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
