'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import useFancybox from '@/hooks/use-fancybox'
import { ProductType } from '@/types/products.types'

export default function ProductDetailPhotos({ product }: { product: ProductType }) {
  const [fancyboxRef] = useFancybox()

  return (
    <div ref={fancyboxRef} className='space-y-2'>
      <Image
        width={500}
        height={500}
        src={product.thumbnail.url}
        alt={product.name}
        className='w-full aspect-square object-cover rounded-md'
      />
      {product.photos.length > 0 && (
        <Carousel
          opts={{
            align: 'start'
          }}
        >
          <CarouselContent className='-ml-2'>
            {product.photos.map((photo) => (
              <CarouselItem key={photo._id} className='basis-1/8 pl-2'>
                <Link data-fancybox='gallery' href={photo.url}>
                  <Image
                    width={50}
                    height={50}
                    src={photo.url}
                    alt=''
                    className='w-full aspect-square object-cover rounded-md'
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant='secondary' className='-left-4' />
          <CarouselNext variant='secondary' className='-right-4' />
        </Carousel>
      )}
    </div>
  )
}
