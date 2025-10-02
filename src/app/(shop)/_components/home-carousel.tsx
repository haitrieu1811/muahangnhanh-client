'use client'

import AutoPlay from 'embla-carousel-autoplay'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function HomeCarousel() {
  return (
    <div className='px-4 md:px-0'>
      <Carousel
        opts={{
          loop: true
        }}
        plugins={[
          AutoPlay({
            delay: 5000
          })
        ]}
      >
        <CarouselContent>
          <CarouselItem className='rounded-md'>
            <div className='bg-blue-400 h-full rounded-md flex items-center justify-between space-x-10'>
              <div className='flex-1 pl-4 lg:pl-20 py-4 space-y-4 text-white'>
                <h3 className='text-2xl tracking-tight'>Học HTML CSS cho người mới</h3>
                <p>
                  Thực hành dự án với Figma, hàng trăm bài tập, hướng dẫn 100% bởi Sơn Đặng, tặng kèm Flashcards, v.v.
                </p>
                <Button variant='secondary' className='rounded-full'>
                  Học thử miễn phí{' '}
                </Button>
              </div>
              <Image
                width={500}
                height={500}
                src={'http://localhost:4000/static/images/20b7ff15e5e4097c5f50c0c01.png'}
                alt=''
                className='h-[240px] object-contain shrink-0 hidden lg:block'
              />
            </div>
          </CarouselItem>
          <CarouselItem className='rounded-md'>
            <div className='bg-main h-full rounded-md flex items-center justify-between space-x-10'>
              <div className='flex-1 pl-4 lg:pl-20 py-4 space-y-4 text-white'>
                <h3 className='text-2xl tracking-tight'>Mở bán khóa Javascript Pro</h3>
                <p>Từ 08/08/2024 khóa học sẽ có giá 1.399k. Khi khóa học hoàn thiện sẽ trở về giá gốc.</p>
                <Button variant='secondary' className='rounded-full'>
                  Học thử miễn phí{' '}
                </Button>
              </div>
              <Image
                width={500}
                height={500}
                src={'http://localhost:4000/static/images/20b7ff15e5e4097c5f50c0c02.png'}
                alt=''
                className='h-[240px] object-contain shrink-0 hidden lg:block'
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious variant='secondary' className='-left-4' />
        <CarouselNext variant='secondary' className='-right-4' />
      </Carousel>
    </div>
  )
}
