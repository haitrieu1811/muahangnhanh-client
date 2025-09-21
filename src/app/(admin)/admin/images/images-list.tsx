'use client'

import { useMutation } from '@tanstack/react-query'
import { Eye, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import mediasApis from '@/apis/medias.apis'
import CustomPagination from '@/components/custom-pagination'
import { Button } from '@/components/ui/button'
import { dateDistance } from '@/lib/utils'
import { ImageType } from '@/types/utils.types'

export default function ImagesList({ images, totalPages }: { images: ImageType[]; totalPages: number }) {
  const router = useRouter()

  const deleteImageMutation = useMutation({
    mutationKey: ['delete-image'],
    mutationFn: mediasApis.deleteImage,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    }
  })

  return (
    <React.Fragment>
      <div className='space-y-10'>
        <div className='grid grid-cols-12 gap-4'>
          {images.map((image) => (
            <div key={image._id} className='col-span-3'>
              <div className='group p-4 bg-muted rounded space-y-2'>
                <div className='relative'>
                  <Image
                    width={200}
                    height={200}
                    src={image.url}
                    alt={image.url}
                    className='w-full aspect-video object-cover rounded'
                  />
                  <div className='absolute bottom-0 inset-x-0 bg-muted/50 p-1 flex justify-center space-x-2 duration-100 opacity-0 group-hover:opacity-100'>
                    <Button asChild size='icon' variant='secondary'>
                      <Link href={image.url} target='_blank'>
                        <Eye />
                      </Link>
                    </Button>
                    <Button size='icon' variant='secondary' onClick={() => deleteImageMutation.mutate(image._id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className='text-sm'>{dateDistance(image.createdAt)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CustomPagination totalPages={totalPages} />
      </div>
    </React.Fragment>
  )
}
