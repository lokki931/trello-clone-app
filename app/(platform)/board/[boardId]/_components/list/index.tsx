import { List, Task } from '@prisma/client';
import { ListOption } from './list-option';
import { ListData } from '../../page';
import { CreateTask } from './create-task';

interface ListProps {
  data: ListData; // Include related tasks if present
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}

export const ListComponent = ({ data, setData }: ListProps) => {
  return (
    <div className="min-w-[228px] bg-slate-900 text-white p-2 rounded-sm shadow-sm">
      <div className="flex justify-between items-center h-8 p-2">
        <span>{data.title}</span>
        <ListOption id={data.id} setData={setData} />
      </div>
      <CreateTask />
    </div>
  );
};
