'use client'

import { CheckCheck, Handbag, IdCard, LucideIcon, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CartContext, CartStepType } from '@/app/(shop)/cart'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { cn } from '@/lib/utils'

const STEPS: {
  icon: LucideIcon
  name: string
  value: CartStepType
}[] = [
  {
    icon: Handbag,
    name: 'Giỏ hàng',
    value: 'list'
  },
  {
    icon: IdCard,
    name: 'Thông tin đặt hàng',
    value: 'info'
  },
  {
    icon: Search,
    name: 'Xem lại đơn hàng',
    value: 'preview'
  },
  {
    icon: CheckCheck,
    name: 'Hoàn tất',
    value: 'success'
  }
] as const

export default function CartStep() {
  const { step: cartStep, handePrevStep } = React.useContext(CartContext)
  return (
    <div className='space-y-2'>
      {/* Nếu đang ở bước giỏ hàng thì hiển thị nút "Mua thêm sản phẩm khác" */}
      {cartStep === 'list' && (
        <Button asChild variant='link' className='text-main dark:text-main-foreground'>
          <Link href={PATH.HOME}>Mua thêm sản phẩm khác</Link>
        </Button>
      )}
      {/* Nếu không phải bước giỏ hàng thì hiển thị nút "Quay lại" */}
      {cartStep !== 'list' && cartStep !== 'success' && (
        <Button variant='link' className='text-main dark:text-main-foreground' onClick={handePrevStep}>
          Quay lại
        </Button>
      )}
      {/* Hiển thị tiến trình các bước */}
      <div className='bg-main/10 dark:bg-main-foreground/10 rounded-md p-8'>
        <div className='grid grid-cols-12 gap-4'>
          {STEPS.map((step) => {
            const isActiveStep = step.value === cartStep
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
