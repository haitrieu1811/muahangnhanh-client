/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { CheckCheck, Handbag, IdCard, LucideIcon, Search } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

const STEPS: {
  icon: LucideIcon
  name: string
  value: string
}[] = [
  {
    icon: Handbag,
    name: 'Giỏ hàng',
    value: PATH.CART
  },
  {
    icon: IdCard,
    name: 'Thông tin đặt hàng',
    value: PATH.CART_ORDER_INFO
  },
  {
    icon: Search,
    name: 'Xem lại đơn hàng',
    value: PATH.CART_ORDER_PREVIEW
  },
  {
    icon: CheckCheck,
    name: 'Hoàn tất',
    value: PATH.CART_CHECKOUT_SUCCESS
  }
] as const

export default function CartStep() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <div className='space-y-2'>
      {/* Nếu đang ở bước giỏ hàng thì hiển thị nút "Mua thêm sản phẩm khác" */}
      {pathname === PATH.CART && (
        <Button asChild variant='link' className='text-main dark:text-main-foreground'>
          <Link href={PATH.PRODUCTS}>Mua thêm sản phẩm khác</Link>
        </Button>
      )}
      {/* Nếu không phải bước giỏ hàng thì hiển thị nút "Quay lại" */}
      {[PATH.CART_ORDER_INFO, PATH.CART_ORDER_PREVIEW].includes(pathname as any) && (
        <Button variant='link' className='text-main dark:text-main-foreground' onClick={() => router.back()}>
          Quay lại
        </Button>
      )}
      {/* Hiển thị tiến trình các bước */}
      <div className='bg-main/10 dark:bg-main-foreground/10 rounded-md p-8'>
        <div className='grid grid-cols-12 gap-4'>
          {STEPS.map((step) => {
            const isActiveStep = step.value === pathname
            return (
              <div key={step.name} className='col-span-3 flex flex-col justify-start items-center space-y-2'>
                <div
                  className={cn(
                    'size-10 rounded-full flex justify-center items-center border-2 border-main dark:border-main-foreground',
                    {
                      'bg-main dark:bg-main-foreground': isActiveStep
                    }
                  )}
                >
                  <step.icon
                    className={cn('size-5', {
                      'stroke-main dark:stroke-main-foreground': !isActiveStep,
                      'stroke-primary-foreground': isActiveStep
                    })}
                  />
                </div>
                <div
                  className={cn('text-sm font-medium text-center', {
                    'text-main dark:text-main-foreground': isActiveStep
                  })}
                >
                  {step.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
