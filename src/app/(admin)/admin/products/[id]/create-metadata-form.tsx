'use client'

import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

import utilsApis from '@/apis/utils.apis'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { handleErrorsFromServer } from '@/lib/utils'
import { MetadataSchema } from '@/rules/utils.rules'
import { MetadataType } from '@/types/utils.types'

export default function CreateMetadataForm({
  documentId,
  metadata
}: {
  documentId: string
  metadata?: MetadataType | null
}) {
  const router = useRouter()

  const form = useFormContext<MetadataSchema>()

  const isUpdateMode = !!metadata

  const createMetadataMutation = useMutation({
    mutationKey: ['create-metadata'],
    mutationFn: utilsApis.createMetadata,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const updateMetadataMutation = useMutation({
    mutationKey: ['update-metadata'],
    mutationFn: utilsApis.updateMetadata,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const isPending = createMetadataMutation.isPending || updateMetadataMutation.isPending

  const handleSubmit = form.handleSubmit((data) => {
    if (!isUpdateMode) {
      createMetadataMutation.mutate({
        body: data,
        documentId
      })
      return
    }
    updateMetadataMutation.mutate({
      body: data,
      metadataId: metadata._id
    })
  })

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form className='space-y-8' onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (tiêu đề)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (mô tả)</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex space-x-2'>
              <Button type='button' variant='outline' onClick={() => form.reset()}>
                Hủy bỏ
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='animate-spin' />}
                {!isUpdateMode ? 'Tạo mới' : 'Lưu lại'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
