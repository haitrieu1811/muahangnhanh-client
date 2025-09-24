'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import blogsApis from '@/apis/blogs.apis'
import SelectImages, { ImageStateType } from '@/app/(admin)/_components/select-images'
import UploadImages from '@/app/(admin)/_components/upload-images'
import RichTextEditor from '@/components/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PATH from '@/constants/path'
import { createBlogRules, CreateBlogSchema } from '@/rules/blogs.rules'

export default function CreateBlogForm() {
  const router = useRouter()

  const [thumbnail, setThumbnail] = React.useState<ImageStateType | null>(null)

  const form = useForm<CreateBlogSchema>({
    resolver: zodResolver(createBlogRules),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  const createBlogMutation = useMutation({
    mutationKey: ['create-blog'],
    mutationFn: blogsApis.createBlog,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.push(PATH.ADMIN_BLOGS)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!thumbnail) return
    createBlogMutation.mutate({
      ...data,
      thumbnail: thumbnail._id
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        {/* Ảnh đại diện */}
        <div className='grid gap-2'>
          <Label>Ảnh đại diện</Label>
          {thumbnail && (
            <Image
              width={200}
              height={200}
              src={thumbnail.url}
              alt=''
              className='size-[200px] object-cover rounded-md'
            />
          )}
          {!thumbnail && form.formState.isSubmitted && (
            <p className='text-sm text-destructive'>Ảnh đại diện là bắt buộc.</p>
          )}
          <div className='space-x-2'>
            <UploadImages />
            <SelectImages onSubmit={(images) => setThumbnail(images[0])} />
          </div>
        </div>
        {/* Tiêu đề */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Nội dung */}
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <RichTextEditor content={field.value} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={createBlogMutation.isPending}>
          {createBlogMutation.isPending && <Loader2 className='animate-spin' />}
          Thêm bài viết
        </Button>
      </form>
    </Form>
  )
}
