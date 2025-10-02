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
import RichTextEditor from '@/components/rich-text-editor'
import SelectImages, { ImageStateType } from '@/components/select-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UploadImages from '@/components/upload-images'
import PATH from '@/constants/path'
import { createBlogRules, CreateBlogSchema } from '@/rules/blogs.rules'
import { BlogType, CreateBlogReqBody } from '@/types/blogs.types'

export default function CreateBlogForm({ blog }: { blog?: BlogType }) {
  const router = useRouter()

  const isUpdateMode = !!blog

  const [thumbnail, setThumbnail] = React.useState<ImageStateType | null>(null)

  React.useEffect(() => {
    if (!blog) return
    setThumbnail(blog.thumbnail)
  }, [blog])

  const form = useForm<CreateBlogSchema>({
    resolver: zodResolver(createBlogRules),
    defaultValues: {
      title: blog?.title ?? '',
      content: blog?.content ?? ''
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

  const updateBlogMutation = useMutation({
    mutationKey: ['update-blog'],
    mutationFn: blogsApis.updateBlog,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    }
  })

  const isPending = createBlogMutation.isPending || updateBlogMutation.isPending

  const handleSubmit = form.handleSubmit((data) => {
    if (!thumbnail) return
    const body: CreateBlogReqBody = {
      ...data,
      thumbnail: thumbnail._id
    }
    // Chế độ tạo mới
    if (!isUpdateMode) {
      createBlogMutation.mutate(body)
      return
    }
    // Chế độ cập nhật
    updateBlogMutation.mutate({
      body,
      id: blog._id
    })
  })

  return (
    <Card>
      <CardContent>
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
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='animate-spin' />}
              {!isUpdateMode ? 'Thêm bài viết' : 'Lưu lại'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
