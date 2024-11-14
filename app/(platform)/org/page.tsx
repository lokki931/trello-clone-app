'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { orgIcon } from '@/data/images';

const OrganizationPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: '',
      img: '',
      userId: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      img: Yup.string().required('Image is required'),
      userId: Yup.string().required('User ID is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch('/api/organization/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          toast.error('Failed to create organization');
          return;
        }
        const organization = await response.json();
        // console.log('Organization created:', organization.id);
        resetForm();
        toast.success('Organization created successfully!');
        setTimeout(() => {
          router.push(`/org/${organization.id}/boards`);
        }, 1000);
      } catch (error) {
        console.error('Error creating organization:', error);
        toast.error('Failed to create organization. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      formik.setFieldValue('userId', session.user.id);
    }
  }, [session?.user?.id]);

  return (
    <div className=" m-5">
      <form onSubmit={formik.handleSubmit} className="max-w-md p-6 space-y-4 rounded shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            className="mt-1 w-full border-gray-300 rounded-md"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          {formik.errors.title && <p className="text-red-600 text-sm">{formik.errors.title}</p>}
        </div>

        <div>
          <Select onValueChange={(value) => formik.setFieldValue('img', value)}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="icon" />
            </SelectTrigger>
            <SelectContent>
              {orgIcon.map((icon) => (
                <SelectItem key={icon.id} value={icon.src}>
                  <Image src={icon.src} width={35} height={35} alt={icon.alt} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.errors.img && <p className="text-red-600 text-sm">{formik.errors.img}</p>}
        </div>

        <Button type="submit" variant="ghost" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default OrganizationPage;
