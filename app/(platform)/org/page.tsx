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
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';

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
      <Popover>
        <PopoverTrigger>
          <div className="h-32 p-3 flex items-center justify-center text-cyan-50 bg-slate-800 hover:bg-white hover:text-black rounded-sm shadow-sm cursor-pointer transition">
            Create Organization
          </div>
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="flex items-center justify-between mb-2">
            <span>Create Organization</span>
            <PopoverClose>
              <X />
            </PopoverClose>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full mb-2">
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter title organization"
                className="w-full border-gray-300 rounded-md"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
              {formik.errors.title && <p className="text-red-600 text-sm">{formik.errors.title}</p>}
            </div>

            <div className="w-full mb-2">
              <Select onValueChange={(value) => formik.setFieldValue('img', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="icon" />
                </SelectTrigger>
                <SelectContent>
                  {orgIcon.map((icon) => (
                    <SelectItem key={icon.id} value={icon.src}>
                      <div className="inline-flex items-center gap-x-3">
                        <Image src={icon.src} width={35} height={35} alt={icon.alt} />
                        <span>{icon.alt}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.errors.img && <p className="text-red-600 text-sm">{formik.errors.img}</p>}
            </div>

            <Button type="submit" className="h-8 w-full">
              Submit
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrganizationPage;
