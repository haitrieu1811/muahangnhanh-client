'use client'

import { CheckCheck, CreditCard, Handbag, IdCard } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useIsClient from '@/hooks/use-is-client'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    icon: Handbag,
    name: 'Giỏ hàng',
    path: PATH.CART
  },
  {
    icon: IdCard,
    name: 'Thông tin đặt hàng',
    path: PATH.CART
  },
  {
    icon: CreditCard,
    name: 'Thanh toán',
    path: PATH.CART
  },
  {
    icon: CheckCheck,
    name: 'Hoàn tất',
    path: PATH.CART
  }
] as const

export default function CartStep() {
  const { totalCartItems, isLoadingMyCart } = useAppContext()
  const isClient = useIsClient()
  return (
    <React.Fragment>
      {totalCartItems > 0 && !isLoadingMyCart && isClient && (
        <div className='space-y-2'>
          <Button asChild variant='link' className='text-main dark:text-main-foreground'>
            <Link href={PATH.HOME}>Mua thêm sản phẩm khác</Link>
          </Button>
          <div className='bg-main/10 dark:bg-main-foreground/10 rounded-md p-8'>
            <div className='grid grid-cols-12 gap-4'>
              {STEPS.map((step, index) => (
                <div key={step.name} className='col-span-3 flex flex-col justify-start items-center space-y-2'>
                  <div
                    className={cn(
                      'size-10 rounded-full flex justify-center items-center border-2 border-main dark:border-main-foreground',
                      {
                        'bg-main dark:bg-main-foreground': index === 0
                      }
                    )}
                  >
                    <step.icon
                      className={cn('size-5', {
                        'stroke-main dark:stroke-main-foreground': index !== 0,
                        'stroke-primary-foreground': index === 0
                      })}
                    />
                  </div>
                  <div
                    className={cn('text-sm font-medium text-center', {
                      'text-main dark:text-main-foreground': index === 0
                    })}
                  >
                    {step.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
