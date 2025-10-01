import { Bell } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import PATH from '@/constants/path'
import { cn } from '@/lib/utils'

const totalNotifications = Object.keys(PATH).length

export default function HeaderNotificationsPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align='end' className='w-[400px] max-w-screen p-0'>
        {totalNotifications > 0 && (
          <React.Fragment>
            <div className='flex justify-between items-center space-x-10 px-4 py-2'>
              <h3 className='tracking-tight'>Thông báo</h3>
              <Button variant='link' className='text-highlight p-0'>
                Đánh dấu tất cả đã đọc
              </Button>
            </div>
            <div className='max-h-[400px] overflow-y-auto'>
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <Link
                    key={index}
                    href={'/'}
                    className={cn('flex items-center space-x-4 p-4 rounded-md duration-100', {
                      'hover:bg-muted': index % 2 === 0,
                      'bg-main/10 dark:bg-main-foreground/10': index % 2 !== 0
                    })}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={'http://localhost:4000/static/images/39300f796a7d8f3b26e17c308.png'}
                      alt=''
                      className='size-[50px] rounded-md aspect-square object-cover shrink-0'
                    />
                    <div className='flex-1'>
                      <h3 className='font-normal text-sm line-clamp-2'>
                        Đơn hàng của bạn đã được xác nhận thành công.
                      </h3>
                      <p className='text-sm text-muted-foreground'>1 giờ trước.</p>
                    </div>
                    {index % 2 !== 0 && <div className='size-2 rounded-full bg-highlight' />}
                  </Link>
                ))}
            </div>
            <div className='flex justify-center px-4 py-2'>
              <Button variant='link' className='p-0 text-highlight'>
                Quản lý thông báo
              </Button>
            </div>
          </React.Fragment>
        )}
        {totalNotifications === 0 && (
          <div className='flex flex-col justify-center items-center p-4 space-y-2'>
            <Bell className='size-10 stroke-1 text-highlight' />
            <p className='text-center text-sm'>Chưa có thông báo nào.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
