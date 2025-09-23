/* eslint-disable @typescript-eslint/no-unused-expressions */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import SelectImages, { ImageStateType } from '@/app/(admin)/_components/select-images'
import UploadImages from '@/app/(admin)/_components/upload-images'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HttpResponse } from '@/lib/http'
import { createProductCategoryRules, CreateProductCategorySchema } from '@/rules/products.rules'
import { CreateProductCategoryResponse } from '@/types/products.types'

export default function CreateProductCategoryForm({
  onSuccess
}: {
  onSuccess?: (data: HttpResponse<CreateProductCategoryResponse>) => void
}) {
  const router = useRouter()

  const [thumbnail, setThumbnail] = React.useState<ImageStateType | null>(null)

  const createProductCategoryMutation = useMutation({
    mutationKey: ['create-product-category'],
    mutationFn: productsApis.createProductCategory,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
      onSuccess && onSuccess(data)
    }
  })

  const form = useForm<CreateProductCategorySchema>({
    resolver: zodResolver(createProductCategoryRules),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!thumbnail) return
    createProductCategoryMutation.mutate({
      ...data,
      thumbnail: thumbnail._id
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        {/* Ảnh đại diện */}
        <div className='grid gap-3'>
          <Label>Ảnh đại diện</Label>
          {thumbnail && (
            <Image width={200} height={200} src={thumbnail.url} alt='' className='size-20 rounded-md object-cover' />
          )}
          {!thumbnail && form.formState.isSubmitted && (
            <p className='text-sm text-destructive'>Ảnh đại diện là bắt buộc</p>
          )}
          <div className='space-x-2'>
            <UploadImages />
            <SelectImages onSubmit={(images) => setThumbnail(images[0])} />
          </div>
        </div>
        {/* Tên */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Mô tả */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={createProductCategoryMutation.isPending}>
          {createProductCategoryMutation.isPending && <Loader2 className='animate-spin' />}
          Thêm
        </Button>
      </form>
    </Form>
  )
}
