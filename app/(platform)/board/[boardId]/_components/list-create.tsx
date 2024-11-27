'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ListData } from '../page';

interface ListCreateProps {
  id: string;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
});

export const ListCreate = ({ id, setData }: ListCreateProps) => {
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: '', // Directly use the board title
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const obj = {
        title: values.title,
        boardId: id,
      };
      try {
        const response = await fetch('/api/list/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        });
        if (!response.ok) {
          toast.error('Failed to create list');
          return;
        }
        const newList = await response.json();
        resetForm();
        toast.success(`${newList.title} - created successfully!`);
        setData((prevLists) => [...prevLists, newList]);
        setOpen(false);
      } catch (error) {
        console.error('Error creating List:', error);
        toast.error('Failed to create List. Please try again.');
      }
    },
  });
  return (
    <div className="min-w-[228px] bg-slate-300 p-2 rounded-sm shadow-sm">
      {!open ? (
        <Button variant="ghost" className="w-full justify-start h-8" onClick={() => setOpen(true)}>
          <Plus />
          <span>Add another list</span>
        </Button>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Input
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange} // Handle title change
            placeholder="Enter list name"
            autoFocus
            className="h-8 p-1 text-sm font-medium bg-transparent focus-visible:ring-0"
          />
          {formik.touched.title && formik.errors.title && (
            <p style={{ color: 'red', fontSize: '0.875rem' }}>{formik.errors.title}</p>
          )}
          <div className="inline-flex items-center gap-x-2 mt-2">
            <Button type="submit" className="h-8">
              Create
            </Button>
            <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-slate-600" />
          </div>
        </form>
      )}
    </div>
  );
};
