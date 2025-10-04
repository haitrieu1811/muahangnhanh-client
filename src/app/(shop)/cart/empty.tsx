'use client'

import { Handbag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import PATH from '@/constants/path'

export default function CartEmpty() {
  const router = useRouter()

  const [seconds, setSeconds] = React.useState<number>(3)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevState) => {
        if (prevState > 0) {
          return (prevState -= 1)
        } else {
          return 0
        }
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  React.useEffect(() => {
    if (seconds === 0) router.push(PATH.CART)
  }, [seconds, router])

  return (
    <div className='flex flex-col justify-center items-center py-10 space-y-2 text-sm text-muted-foreground'>
      <Handbag className='size-10 stroke-1 text-main dark:text-main-foreground' />
      <p>Chưa chọn sản phẩm nào để mua</p>
      <p>
        Bạn sẽ trở về trang giỏ hàng sau <strong className='text-main dark:text-main-foreground'>{seconds}</strong> giây
      </p>
    </div>
  )
}
