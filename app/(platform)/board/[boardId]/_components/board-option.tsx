'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
interface BoardOptionProps {
  id: string;
  orgId: string;
}

export const BoardOption = ({ id, orgId }: BoardOptionProps) => {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/board/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast(`Error deleting board: ${errorData}`);
        return;
      }

      const data = await response.json();

      toast(data?.message);
      setTimeout(() => {
        router.push(`/org/${orgId}/boards/`);
      }, 1000);
    } catch (error) {
      console.error('Error making DELETE request:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="hover:bg-white cursor-pointer rounded-sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          Delete Board
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
