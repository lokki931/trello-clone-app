'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListData } from '../../page';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface listTitleProps {
  id: string;
  listId: string;
  description: string;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}

export const TaskDescription = ({ id, listId, description, setData }: listTitleProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      description: description || '', // Directly use the board title
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/api/list/${listId}/task/update/desc`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: values.description,
            id,
          }),
        });
        if (!response.ok) {
          toast('Failed to update description');
          throw new Error('Failed to update description');
        }
        const updatedList = await response.json();
        setData((prevLists) =>
          prevLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tasks: list.tasks.map((task) =>
                    task.id === id ? { ...task, description: updatedList?.description } : task,
                  ),
                }
              : list,
          ),
        );
        setOpen(false); // Close input after submission
        toast('Update task description');
      } catch (error) {
        toast(`Error updating description: ${error}`);
      }
    },
  });
  return (
    <>
      {!open ? (
        <div
          onClick={handleClick}
          className="min-h-[80px] p-2 text-sm cursor-pointer hover:opacity-60 rounded-sm border">
          {formik.values.description || 'Enter description...'}{' '}
          {/* Fallback for when data is undefined */}
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange} // Handle title change
            autoFocus
            className="w-full min-h-10 p-2 text-sm font-medium bg-transparent "
          />
          <div className="inline-flex items-center gap-x-2 mt-2">
            <Button type="submit" className="h-8">
              Update
            </Button>
            <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-slate-600" />
          </div>
        </form>
      )}
    </>
  );
};
