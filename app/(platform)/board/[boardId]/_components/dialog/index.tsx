'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Task } from '@prisma/client';
import { ListData } from '../../page';
import { TaskTitle } from './task-title';
import { TaskDescription } from './task-desc';
import { TaskActions } from './task-actions';
interface TaskDialogProps {
  data: Task;
  onClose: () => void;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}
export default function TaskDialog({ data, onClose, setData }: TaskDialogProps) {
  return (
    <Dialog open={!!data} onOpenChange={(open) => !open && onClose()}>
      {/* <DialogTrigger>
          setData((prevLists) =>
            prevLists.map((list) =>
              list.id === data.listId
                ? {
                    ...list,
                    tasks: list.tasks.map((task) =>
                      task.id === data.id ? { ...task, title: newTitle } : task
                    ),
                  }
                : list
            )
          );
        <button className="px-4 py-2 bg-blue-500 text-white rounded">View Todo</button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <TaskTitle title={data.title} id={data.id} listId={data.listId} setData={setData} />
          </DialogTitle>
          {/* <DialogDescription>{data?.description}</DialogDescription> */}
        </DialogHeader>
        <div className="flex items-stretch justify-between gap-x-4">
          <div className="grow">
            <TaskDescription
              description={data.description as string}
              id={data.id}
              listId={data.listId}
              setData={setData}
            />
          </div>
          <div className="basis-1/4 flex flex-col gap-2">
            <TaskActions id={data.id} listId={data.listId} setData={setData} onClose={onClose} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
