import { Button } from '@/components/ui/button';
import { ListData } from '../../page';
import { toast } from 'sonner';

interface TaskActionsProps {
  id: string;
  listId: string;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
  onClose: () => void;
}

export const TaskActions = ({ id, listId, setData, onClose }: TaskActionsProps) => {
  const handleCopy = async () => {
    try {
      const response = await fetch(`/api/list/${listId}/task/copy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast(`Error copy task: ${errorData}`);
        return;
      }

      const newTask = await response.json();

      toast.success(`${newTask.title} - created successfully!`);
      setData((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: [...list.tasks, newTask],
              }
            : list,
        ),
      );
      onClose();
    } catch (error) {
      console.error('Error making DELETE request:', error);
    }
  };
  const handleRemove = async () => {
    try {
      const response = await fetch(
        `/api/list/${listId}/task/delete?taskId=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast(`Error deleting task: ${errorData}`);
        return;
      }

      const data = await response.json();

      toast(data?.message);
      setData((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.filter((task) => task.id !== id),
              }
            : list,
        ),
      );
      onClose();
    } catch (error) {
      console.error('Error making DELETE request:', error);
    }
  };
  return (
    <>
      <h4 className="font-semibold text-sm italic">Action</h4>
      <Button onClick={handleCopy} className="h8 w-full p-2 justify-start">
        Copy
      </Button>
      <Button
        onClick={handleRemove}
        className="h8 w-full p-2 justify-start bg-red-500 text-white hover:bg-red-700">
        Remove
      </Button>
    </>
  );
};
