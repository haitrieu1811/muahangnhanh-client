import { Banknote, Handbag, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useAppContext from '@/hooks/use-app-context'
import { formatCurrency } from '@/lib/utils'
import PATH from '@/constants/path'

export default function HeaderCart() {
  const { extendedCartItems, totalCartItems, totalCartAmount } = useAppContext()
  return (
    <React.Fragment>
      {totalCartItems > 0 && (
        <React.Fragment>
          <div className='flex justify-between items-center space-x-10 px-4 py-2'>
            <h3 className='tracking-tight'>Giỏ hàng</h3>
            <div className='px-4 py-2 flex items-center space-x-6'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center space-x-1'>
                    <Handbag className='text-highlight size-4' />
                    <span className='text-sm'>{totalCartItems}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tổng sản phẩm</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center space-x-1'>
                    <Banknote className='text-highlight size-4' />
                    <span className='text-sm'>{formatCurrency(totalCartAmount)}&#8363;</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tổng tiền</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className='max-h-[400px] overflow-y-auto'>
            {extendedCartItems.map((cartItem) => (
              <Link
                key={cartItem._id}
                href={PATH.PRODUCTS_DETAIL({
                  name: cartItem.product.name,
                  id: cartItem.product._id
                })}
                className='flex items-center space-x-4 p-4 duration-100 hover:bg-muted'
              >
                <Image
                  width={50}
                  height={50}
                  src={cartItem.product.thumbnail}
                  alt={cartItem.product.name}
                  className='size-[50px] aspect-square object-cover rounded-md shrink-0'
                />
                <div className='flex-1 space-y-0.5'>
                  <h3 className='text-sm font-normal line-clamp-2'>{cartItem.product.name}</h3>
                  <div className='flex items-center space-x-1'>
                    <span className='text-sm text-highlight font-medium'>
                      {formatCurrency(cartItem.unitPriceAfterDiscount)}&#8363;
                    </span>
                    <X className='size-3' />
                    <span className='text-sm font-medium'>{cartItem.quantity}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className='flex justify-center px-4 py-2'>
            <Button asChild variant='link' className='p-0 text-highlight'>
              <Link href={PATH.CART}>Quản lý giỏ hàng</Link>
            </Button>
          </div>
        </React.Fragment>
      )}

      {totalCartItems === 0 && (
        <div className='flex flex-col justify-center items-center p-4 space-y-2'>
          <Handbag className='size-10 stroke-1 text-highlight' />
          <p className='text-center text-sm'>Chưa có sản phẩm nào trong giỏ hàng.</p>
        </div>
      )}
    </React.Fragment>
  )
}
