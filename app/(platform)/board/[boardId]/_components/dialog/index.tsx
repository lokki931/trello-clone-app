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
            <h4 className="font-semibold text-sm italic">Action</h4>
            <p>Copy</p>
            <p>Remove</p>
          </div>
        </div>
        <p>Todo ID: {data.id}</p>
        <button onClick={() => onClose()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}
