import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export default function OrderSuccess() {
  return (
    <div className='flex flex-col items-center justify-center space-y-4 py-10 rounded-md'>
      <CheckCircle2 className='stroke-green-500 stroke-1 size-16' />
      <p className='text-center text-sm font-medium px-10'>
        Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
      </p>
      <div className='flex space-x-2'>
        <Button
          asChild
          variant='outline'
          className='border-main dark:border-main-foreground text-main dark:text-main-foreground hover:text-main'
        >
          <Link href={PATH.HOME}>Quay về trang chủ</Link>
        </Button>
        <Button asChild className='bg-highlight'>
          <Link href={PATH.ACCOUNT_ORDERS}>Xem đơn hàng</Link>
        </Button>
      </div>
    </div>
  )
}
