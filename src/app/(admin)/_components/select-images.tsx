/* eslint-disable @typescript-eslint/no-unused-expressions */

'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import mediasApis from '@/apis/medias.apis'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ImageType } from '@/types/utils.types'

/**
 * Prop `onChange` cung cấp một danh sách hình ảnh cho dù ở chế độ
 * chọn một ảnh - truy cập vào phần tử đầu tiên `Array[0]` để lấy dữ liệu hình
 * ảnh đó.
 */
export default function SelectImages({
  multiple = false,
  onChange,
  onSubmit
}: {
  multiple?: boolean
  onChange?: (images: ImageType[]) => void
  onSubmit?: (images: ImageType[]) => void
}) {
  const imagesListRef = React.useRef<HTMLDivElement>(null)

  const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedImages, setSelectedImages] = React.useState<ImageType[]>([])

  const getImagesQuery = useQuery({
    queryKey: ['get-images', { currentPage }],
    queryFn: () => mediasApis.getImagesFromNextClientToServer({ page: currentPage, limit: 40 }),
    enabled: isOpenDialog
  })

  const images = React.useMemo(
    () => getImagesQuery.data?.payload.data.images ?? [],
    [getImagesQuery.data?.payload.data.images]
  )

  const totalPages = getImagesQuery.data?.payload.data.pagination.totalPages ?? 1

  const handlePrev = () => {
    setCurrentPage((prevState) => (prevState -= 1))
    imagesListRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const handleNext = () => {
    setCurrentPage((prevState) => (prevState += 1))
    imagesListRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const handleCancel = () => {
    setSelectedImages([])
    setIsOpenDialog(false)
  }

  const handleSelectImages = (image: ImageType) => {
    const isExisted = selectedImages.map((item) => item._id).includes(image._id)
    // Chế độ chọn nhiều ảnh
    if (multiple) {
      let result = selectedImages
      // Nếu chưa được chọn thì chọn ảnh và ngược lại chọn rồi hình loại ra (toggle)
      if (!isExisted) {
        result = [...result, image]
      } else {
        result = selectedImages.filter((item) => item._id !== image._id)
      }
      setSelectedImages(result)
      onChange && onChange(result)
      return
    }
    // Chế độ chọn một ảnh
    if (!isExisted) {
      setSelectedImages([image])
      onChange && onChange([image])
    } else {
      setSelectedImages([])
      onChange && onChange([])
    }
  }

  const handleSubmit = () => {
    setIsOpenDialog(false)
    onSubmit && onSubmit(selectedImages)
  }

  return (
    <React.Fragment>
      <Button type='button' onClick={() => setIsOpenDialog(true)}>
        <ImageIcon />
        Chọn ảnh có sẵn
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto min-w-[50vw]'>
          <DialogHeader>
            <DialogTitle>Lựa chọn hình ảnh</DialogTitle>
          </DialogHeader>
          {/* Danh sách */}
          <div ref={imagesListRef} className='grid grid-cols-12 gap-4'>
            {images.map((image) => (
              <div key={image._id} className='col-span-3'>
                <div
                  role='button'
                  className={cn('p-1 rounded-md border-3', {
                    'border-blue-500': selectedImages.map((item) => item._id).includes(image._id)
                  })}
                  onClick={() => handleSelectImages(image)}
                >
                  <Image
                    width={200}
                    height={200}
                    src={image.url}
                    alt=''
                    className='aspect-square rounded-md object-cover'
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Phân trang */}
          <div className='flex justify-between items-center space-x-10'>
            <div className='text-sm'>
              Trang {currentPage}/{totalPages}
            </div>
            <div className='flex space-x-2'>
              <div
                className={cn({
                  'cursor-not-allowed': currentPage === 1
                })}
              >
                <Button type='button' variant='outline' size='sm' disabled={currentPage === 1} onClick={handlePrev}>
                  <ChevronLeft />
                  Trước
                </Button>
              </div>
              <div
                className={cn({
                  'cursor-not-allowed': currentPage === totalPages
                })}
              >
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  Sau
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type='button' disabled={selectedImages.length < 1} onClick={handleSubmit}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
