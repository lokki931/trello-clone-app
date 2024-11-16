'use client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';

import { boardImg } from '@/data/images';

type BorderImg = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
};
interface CreateBoardProps {
  orgId: string;
  children: React.ReactNode;
}

export const CreateBoard = ({ orgId, children }: CreateBoardProps) => {
  const [checked, setChecked] = useState<BorderImg>(boardImg[0]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const obj = {
        title: values.title,
        imgFull: checked.src,
        imgThumb: checked.thumb,
        organizationId: orgId,
      };
      try {
        const response = await fetch('/api/board/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        });
        if (!response.ok) {
          toast.error('Failed to create board');
          return;
        }
        const board = await response.json();
        console.log('Board created:', board.id);
        resetForm();
        toast.success('Board created successfully!');
        // setTimeout(() => {
        //   router.push(`/board/${board.id}`);
        // }, 1000);
      } catch (error) {
        console.error('Error creating Board:', error);
        toast.error('Failed to create Board. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Popover>
      <PopoverTrigger>
        {children}
        {orgId}
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex items-center justify-between">
          <span>Create Board</span>
          <PopoverClose>
            <X />
          </PopoverClose>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-2">
          <div className="grid grid-cols-4 gap-2">
            {boardImg.map((img) => (
              <div
                onClick={() => setChecked(img)}
                key={img.id}
                className="w-full h-8 bg-cover bg-center flex items-center justify-center cursor-pointer"
                style={{ backgroundImage: `url(${img.thumb})` }}>
                {checked.id === img.id && <Check className="text-white" />}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Input
              id="title"
              name="title"
              type="text"
              className="w-full h-8"
              onChange={formik.handleChange}
              value={formik.values.title}
              placeholder="Enter title"
            />
            {formik.errors.title && <p className="text-red-600 text-sm">{formik.errors.title}</p>}
          </div>
          <Button type="submit" className="w-full h-8 mt-2">
            Create
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
