'use client'

import { Handbag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import QuantityController from '@/components/quantity-controller'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useIsClient from '@/hooks/use-is-client'
import { formatCurrency } from '@/lib/utils'

export default function CartList() {
  const { cartItems, totalCartItems, totalCartAmount, isFetchingMyCart } = useAppContext()
  const isClient = useIsClient()
  return (
    <React.Fragment>
      {totalCartItems > 0 && isClient && !isFetchingMyCart && (
        <div className='space-y-6'>
          <div className='space-y-4'>
            {cartItems.map((cartItem) => (
              <div key={cartItem._id} className='flex space-x-4'>
                <div className='flex items-center'>
                  <Checkbox />
                </div>
                <Link
                  href={PATH.PRODUCTS_DETAIL({
                    name: cartItem.product.name,
                    id: cartItem.product._id
                  })}
                  className='shrink-0 border p-2 rounded-md'
                >
                  <Image
                    width={100}
                    height={100}
                    src={cartItem.product.thumbnail}
                    alt={cartItem.product.name}
                    className='size-[80px] aspect-square object-cover rounded-md'
                  />
                </Link>
                <div className='flex-1'>
                  <Link
                    href={PATH.PRODUCTS_DETAIL({
                      name: cartItem.product.name,
                      id: cartItem.product._id
                    })}
                    className='font-medium text-sm line-clamp-2'
                  >
                    {cartItem.product.name}
                  </Link>
                  <Button variant='link' className='p-0 text-destructive'>
                    Xóa
                  </Button>
                </div>
                <div className='flex flex-col items-end space-y-2'>
                  {cartItem.product.priceAfterDiscount < cartItem.product.price ? (
                    <div>
                      <div className='font-semibold text-main dark:text-main-foreground'>
                        {formatCurrency(cartItem.product.priceAfterDiscount)}&#8363;
                      </div>
                      <div className='text-sm text-muted-foreground line-through'>
                        {formatCurrency(cartItem.product.price)}&#8363;
                      </div>
                    </div>
                  ) : (
                    <div className='font-semibold text-main dark:text-main-foreground'>
                      {formatCurrency(cartItem.product.price)}&#8363;
                    </div>
                  )}
                  <QuantityController defaultValue={cartItem.quantity} size='sm' />
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <div className='font-medium'>Tổng tiền</div>
              <div className='text-main dark:text-main-foreground font-semibold text-2xl'>
                {formatCurrency(totalCartAmount)}&#8363;
              </div>
            </div>
            <Button size='lg' className='w-full bg-highlight uppercase'>
              Đặt hàng ngay
            </Button>
          </div>
        </div>
      )}
      {totalCartItems === 0 && isClient && !isFetchingMyCart && (
        <div className='flex flex-col justify-center items-center space-y-4'>
          <Handbag className='text-main dark:text-main-foreground size-10 stroke-1' />
          <p className='text-center'>Chưa có sản phẩm nào trong giỏ hàng</p>
          <Button
            asChild
            variant='outline'
            className='border-main dark:border-main-foreground text-main dark:text-main-foreground hover:text-main'
          >
            <Link href={PATH.HOME}>Bắt đầu mua hàng</Link>
          </Button>
        </div>
      )}
    </React.Fragment>
  )
}
