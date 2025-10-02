'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Handbag, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import cartItemsApis from '@/apis/cartItems.apis'
import QuantityController from '@/components/quantity-controller'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useIsClient from '@/hooks/use-is-client'
import { cn, formatCurrency } from '@/lib/utils'
import { CartContext } from '@/app/(shop)/cart'

export default function CartList() {
  const queryClient = useQueryClient()

  const {
    extendedCartItems,
    totalCartItems,
    totalCheckedCartAmount,
    isLoadingMyCart,
    isAllChecked,
    setExtendedCartItems,
    handleCheckAllCartItems
  } = useAppContext()
  const isClient = useIsClient()
  const { setStep } = React.useContext(CartContext)

  // Xử lý chọn một sản phẩm trong giỏ hàng -> checkout
  const handleCheck = ({ isChecked, cartItemId }: { isChecked: boolean; cartItemId: string }) => {
    setExtendedCartItems((cartItems) =>
      cartItems.map((cartItem) => {
        if (cartItem._id === cartItemId) {
          return {
            ...cartItem,
            isChecked
          }
        }
        return cartItem
      })
    )
  }

  const updateCartItemMutation = useMutation({
    mutationKey: ['update-cart-item'],
    mutationFn: cartItemsApis.updateCartItem,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      queryClient.refetchQueries({
        queryKey: ['get-my-cart']
      })
    }
  })

  const handleUpdate = (body: { quantity: number; cartItemId: string }) => {
    updateCartItemMutation.mutate(body)
  }

  const deleteCartItemsMutation = useMutation({
    mutationKey: ['delete-cart-items'],
    mutationFn: cartItemsApis.deleteCartItems,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      queryClient.refetchQueries({
        queryKey: ['get-my-cart']
      })
    }
  })

  const handleDelete = (cartItemIds: string[]) => {
    deleteCartItemsMutation.mutate({ cartItemIds })
  }

  return (
    <React.Fragment>
      {/* Danh sách sản phẩm trong giỏ hàng */}
      {totalCartItems > 0 && isClient && !isLoadingMyCart && (
        <div className='space-y-6'>
          <div className='space-y-2'>
            {extendedCartItems.map((cartItem) => {
              const isActive = cartItem.product.isActive
              return (
                <div
                  key={cartItem._id}
                  className={cn('flex flex-wrap items-center space-x-4 rounded-md p-4', {
                    'bg-muted': cartItem.isChecked,
                    'border-2 border-destructive': !isActive
                  })}
                >
                  {/* Checkbox */}
                  <Checkbox
                    disabled={!isActive}
                    checked={cartItem.isChecked}
                    onCheckedChange={(isChecked) =>
                      handleCheck({
                        isChecked: isChecked as boolean,
                        cartItemId: cartItem._id
                      })
                    }
                  />
                  {/* Hỉnh ảnh */}
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
                      className='size-10 md:size-[80px] aspect-square object-cover rounded-md'
                    />
                  </Link>
                  {/* Tên - Xóa sản phẩm */}
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
                    <Button
                      variant='link'
                      className='p-0 text-destructive'
                      onClick={() => handleDelete([cartItem._id])}
                    >
                      Xóa
                    </Button>
                    {!isActive && <p className='text-sm text-muted-foreground'>Tạm ngừng hoạt động</p>}
                  </div>
                  {/* Giá và cập nhật số lượng */}
                  <div className='flex flex-col items-end space-y-2 w-full md:w-auto'>
                    {cartItem.product.priceAfterDiscount < cartItem.product.price ? (
                      <div className='text-right'>
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
                    <QuantityController
                      size='sm'
                      disabled={!isActive}
                      defaultValue={cartItem.quantity}
                      onIncrease={(value) =>
                        handleUpdate({
                          cartItemId: cartItem._id,
                          quantity: value
                        })
                      }
                      onDecrease={(value) =>
                        handleUpdate({
                          cartItemId: cartItem._id,
                          quantity: value
                        })
                      }
                      onBlur={(value) =>
                        handleUpdate({
                          cartItemId: cartItem._id,
                          quantity: value
                        })
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <Separator />
          <div className='space-y-4'>
            <div>
              <div className='flex items-center space-x-4'>
                <Checkbox id='checkAll' checked={isAllChecked} onCheckedChange={handleCheckAllCartItems} />
                <Label htmlFor='checkAll'>Chọn tất cả</Label>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='font-medium'>Tổng tiền</div>
              <div className='text-main dark:text-main-foreground font-semibold text-2xl'>
                {formatCurrency(totalCheckedCartAmount)}&#8363;
              </div>
            </div>
            <div
              className={cn({
                'cursor-not-allowed': totalCheckedCartAmount === 0
              })}
            >
              <Button
                size='lg'
                disabled={totalCheckedCartAmount === 0}
                className='w-full bg-highlight uppercase'
                onClick={() => setStep('info')} // Chuyển sang bước nhập thông tin đặt hàng
              >
                Đặt hàng ngay
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Giỏ hàng trống */}
      {totalCartItems === 0 && isClient && !isLoadingMyCart && (
        <div className='flex flex-col justify-center items-center space-y-4 py-8'>
          <Handbag className='text-main dark:text-main-foreground size-10 stroke-1' />
          <p className='text-center'>Chưa có sản phẩm nào trong giỏ hàng</p>
          <Button
            asChild
            variant='outline'
            className='border-main dark:border-main-foreground text-main dark:text-main-foreground hover:text-main'
          >
            <Link href={PATH.PRODUCTS}>Bắt đầu mua hàng</Link>
          </Button>
        </div>
      )}
      {/* Loading */}
      {isLoadingMyCart && isClient && (
        <div className='flex justify-center items-center py-8'>
          <Loader2 className='size-10 stroke-1 animate-spin text-main dark:text-main-foreground' />
        </div>
      )}
    </React.Fragment>
  )
}
