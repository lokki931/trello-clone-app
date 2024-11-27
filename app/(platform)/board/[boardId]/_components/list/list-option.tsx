'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';

import { toast } from 'sonner';
import { ListData } from '../../page';
interface ListOptionProps {
  id: string;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}

export const ListOption = ({ id, setData }: ListOptionProps) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/list/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast(`Error deleting list: ${errorData}`);
        return;
      }

      const data = await response.json();

      toast(data?.message);
      setData((prevLists) => prevLists.filter((list) => list.id !== id));
    } catch (error) {
      console.error('Error making DELETE request:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer hover:text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          Delete List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
