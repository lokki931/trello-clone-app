'use client';
import { Organization } from '@prisma/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface OrgNameProps {
  data: Organization;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

export const OrgName = ({ data }: OrgNameProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: data?.title || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/api/organization/${data.id}/update/title`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: values.title }),
        });

        if (!response.ok) {
          toast.error('Failed to update title');
          return;
        }

        const updatedData = await response.json();
        toast.success(`Title updated to: ${updatedData.title}`);
        setOpen(false);
        window.location.reload();
      } catch (error) {
        toast.error('Error updating title');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      {!open ? (
        <Button
          variant="ghost"
          className="w-full h-8 justify-start py-1 px-2"
          onClick={() => setOpen(true)}>
          Edit title
        </Button>
      ) : (
        <form className="relative flex items-center px-2" onSubmit={formik.handleSubmit}>
          <Input
            id="title"
            name="title"
            aria-label="Organization Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="h-8 p-1 flex-shrink text-sm font-medium bg-transparent focus-visible:ring-0"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="absolute -bottom-6 left-0 text-red-600 text-sm">{formik.errors.title}</p>
          )}
          <Button type="submit" className="p-1 h-8" disabled={isSubmitting}>
            {isSubmitting ? '...' : <Check />}
          </Button>
        </form>
      )}
    </>
  );
};
