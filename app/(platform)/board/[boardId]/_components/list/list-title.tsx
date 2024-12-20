'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListData } from '../../page';

interface listTitleProps {
  id: string;
  title: string;
  setData: React.Dispatch<React.SetStateAction<ListData[]>>;
}
const validationSchema = Yup.object().shape({
  title: Yup.string().required('required'),
});
export const ListTitle = ({ id, title, setData }: listTitleProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      title: title || '', // Directly use the board title
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/api/list/${id}/update/title`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: values.title,
          }),
        });
        if (!response.ok) {
          toast('Failed to update title');
          throw new Error('Failed to update title');
        }
        const updatedList = await response.json();
        setData((prevLists) =>
          prevLists.map((list) => (list.id === id ? { ...list, title: updatedList?.title } : list)),
        );
        setOpen(false); // Close input after submission
        toast('Update list title');
      } catch (error) {
        toast(`Error updating title: ${error}`);
      }
    },
  });
  const handleBlur = () => {
    if (formik.values.title !== title) {
      formik.handleSubmit(); // Submit only if title is changed
    } else {
      setOpen(false); // Close input if no changes were made
    }
  };
  return (
    <span className="truncate">
      {!open ? (
        <Button onClick={handleClick} variant="ghost" className="h-8 p-1 text-sm">
          {title || 'Loading...'} {/* Fallback for when data is undefined */}
        </Button>
      ) : (
        <div className="relative">
          <Input
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange} // Handle title change
            onBlur={handleBlur} // Submit form on blur if changed
            autoFocus
            className="w-full h-8 p-1 text-sm font-medium bg-transparent "
          />
          {formik.touched.title && formik.errors.title && (
            <p
              className="absolute -bottom-6 left-0 bg-white"
              style={{ color: 'red', fontSize: '0.875rem' }}>
              {formik.errors.title}
            </p>
          )}
        </div>
      )}
    </span>
  );
};
