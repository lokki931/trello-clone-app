'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Board } from '@prisma/client';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

interface BoardHeaderProps {
  data: Board;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('required'),
});

export const BoardHeader = ({ data }: BoardHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [board, setBoard] = useState<Board>(data); // Track board state directly

  const formik = useFormik({
    initialValues: {
      title: board?.title || '', // Directly use the board title
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Send PUT request to update the board title
        const response = await fetch(`/api/board/${board.id}/update/title`, {
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

        const updatedBoard = await response.json();
        setBoard(updatedBoard); // Update the board state with the new title
        setOpen(false); // Close input after submission
        toast('Update board title');
      } catch (error) {
        toast(`Error updating title: ${error}`);
      }
    },
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    if (formik.values.title !== board.title) {
      formik.handleSubmit(); // Submit only if title is changed
    } else {
      setOpen(false); // Close input if no changes were made
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e); // Update Formik state
  };

  return (
    <>
      {!open ? (
        <Button onClick={handleClick} variant="ghost" className="h-8 p-1 text-sm">
          {board?.title || 'Loading...'} {/* Fallback for when data is undefined */}
        </Button>
      ) : (
        <div className="relative">
          <Input
            id="title"
            name="title"
            value={formik.values.title}
            onChange={handleChange} // Handle title change
            onBlur={handleBlur} // Submit form on blur if changed
            autoFocus
            size={formik.values.title.length || 1}
            className="h-8 p-1 text-sm font-medium bg-transparent focus-visible:ring-0"
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
    </>
  );
};
