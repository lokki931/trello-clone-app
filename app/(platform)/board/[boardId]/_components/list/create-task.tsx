'use client';
import { toast } from 'sonner';
import { ListData } from '../../page';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ListOptionProps {
  id: string;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
});
export const CreateTask = ({ id, setData }: ListOptionProps) => {
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: '', // Directly use the board title
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const obj = {
        title: values.title,
      };
      try {
        const response = await fetch(`/api/list/${id}/task/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        });
        if (!response.ok) {
          toast.error('Failed to create task');
          return;
        }
        const newTask = await response.json();
        resetForm();
        toast.success(`${newTask.title} - created successfully!`);
        setData((prevLists) =>
          prevLists.map((list) =>
            list.id === id ? { ...list, tasks: [...list.tasks, newTask] } : list,
          ),
        );

        setOpen(false);
      } catch (error) {
        console.error('Error creating task:', error);
        toast.error('Failed to create task. Please try again.');
      }
    },
  });

  return (
    <div className="p-2 mt-2">
      {!open ? (
        <Button
          variant="ghost"
          className="w-full p-1 justify-start  h-8"
          onClick={() => setOpen(true)}>
          <Plus />
          <span>Add task</span>
        </Button>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Textarea
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange} // Handle title change
            placeholder="Enter task name"
            autoFocus
            rows={2}
            className="min-h-[40px] resize-none p-1 text-sm font-medium bg-transparent focus-visible:ring-0"
          />
          {formik.touched.title && formik.errors.title && (
            <p style={{ color: 'red', fontSize: '0.875rem' }}>{formik.errors.title}</p>
          )}
          <div className="inline-flex items-center gap-x-2 mt-2">
            <Button type="submit" className="h-8" variant="secondary">
              Create
            </Button>
            <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-slate-600" />
          </div>
        </form>
      )}
    </div>
  );
};
