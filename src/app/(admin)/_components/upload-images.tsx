/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useMutation } from '@tanstack/react-query'
import { Eye, Loader2, PlusCircle, Trash, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import mediasApis from '@/apis/medias.apis'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HttpResponse } from '@/lib/http'
import { UploadImagesResponse } from '@/types/utils.types'

type UploadImagesProps = {
  onSuccess?: (data: HttpResponse<UploadImagesResponse>) => void
}

export default function UploadImages({ onSuccess }: UploadImagesProps) {
  const router = useRouter()

  const [files, setFiles] = React.useState<File[]>([])
  const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false)

  const previewImages = React.useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleStart = () => {
    inputRef.current?.click()
  }

  const handleCancel = () => {
    setFiles([])
    setIsOpenDialog(false)
  }

  const handleDeletePreviewImage = (previewImage: string) => {
    const index = previewImages.findIndex((item) => item === previewImage)
    setFiles((prevState) => prevState.filter((_, _index) => _index !== index))
  }

  const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const maxFileSize = 300 * 1024 // 300KB
      // Lọc ra những file có kích thước nhỏ hơn hoặc bằng kích thước tối đa cho phép
      const validFiles = [...files].filter((file) => file.size <= maxFileSize)
      setFiles((prevState) => [...prevState, ...validFiles])
    }
  }

  const uploadImagesMutation = useMutation({
    mutationKey: ['upload-images'],
    mutationFn: mediasApis.uploadImages,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      handleCancel()
      router.refresh()
      onSuccess && onSuccess(data)
    }
  })

  const handleUploadImages = () => {
    if (uploadImagesMutation.isPending || files.length === 0) return
    const form = new FormData()
    files.forEach((file) => {
      form.append('image', file)
    })
    uploadImagesMutation.mutate(form)
  }

  return (
    <React.Fragment>
      <Button type='button' variant='outline' onClick={() => setIsOpenDialog(true)}>
        <PlusCircle />
        Thêm ảnh mới
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto min-w-[50vw]'>
          <DialogHeader>
            <DialogTitle>Thêm ảnh mới</DialogTitle>
          </DialogHeader>
          <input
            hidden
            multiple
            ref={inputRef}
            type='file'
            onChange={handleChangeFiles}
            onClick={(e) => ((e.target as any).value = null)}
          />

          {files.length === 0 && (
            <button
              type='button'
              className='bg-muted rounded-md flex flex-col justify-center items-center p-10 space-y-2'
              onClick={handleStart}
            >
              <UploadCloud />
              <p className='text-sm text-muted-foreground'>Tải ảnh lên</p>
            </button>
          )}

          {files.length > 0 && (
            <div className='space-y-2'>
              <div className='space-y-2'>
                <div className='text-sm'>{files.length} ảnh sẵn sàng tải lên.</div>
                <div className='text-sm text-muted-foreground'>
                  Hệ thống sẽ tự động loại bỏ những file lớn hơn kích thước tối đa cho phép là{' '}
                  <strong className='font-semibold text-destructive'>300KB</strong>
                </div>
              </div>
              <div className='grid grid-cols-12 gap-2'>
                {previewImages.map((previewImage) => (
                  <div key={previewImage} className='group col-span-4 relative'>
                    <Image
                      width={200}
                      height={200}
                      src={previewImage}
                      alt={previewImage}
                      className='w-full aspect-video rounded-md'
                    />
                    <div className='absolute bottom-0 inset-x-0 p-2 bg-muted-foreground/50 flex justify-end space-x-1 opacity-0 group-hover:opacity-100 duration-100 rounded-b-md'>
                      <Button type='button' asChild size='icon' variant='secondary'>
                        <Link href={previewImage} target='_blank'>
                          <Eye />
                        </Link>
                      </Button>
                      <Button
                        type='button'
                        size='icon'
                        variant='secondary'
                        onClick={() => handleDeletePreviewImage(previewImage)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                ))}
                <div
                  className='col-span-4 bg-muted rounded-md flex flex-col justify-center items-center space-y-2 aspect-video'
                  role='button'
                  onClick={handleStart}
                >
                  <PlusCircle />
                  <p className='text-sm text-muted-foreground'>Thêm ảnh khác</p>
                </div>
              </div>
            </div>
          )}
          {files.length > 0 && (
            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleCancel}>
                Hủy bỏ
              </Button>
              <Button type='button' disabled={uploadImagesMutation.isPending} onClick={handleUploadImages}>
                {uploadImagesMutation.isPending && <Loader2 className='animate-spin' />}
                Tải {files.length} ảnh lên
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
