'use client'

import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'

import CreateAddressButton from '@/app/(shop)/account/addresses/create-address-button'
import CartEmpty from '@/app/(shop)/cart/empty'
import AddressItem from '@/components/address-item'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { ShippingMethod } from '@/constants/enum'
import PATH from '@/constants/path'
import useCartContext from '@/hooks/use-cart-context'
import useCheckoutContext from '@/hooks/use-checkout-context'
import { cn, formatCurrency } from '@/lib/utils'

export default function OrderInfo() {
  const queryClient = useQueryClient()

  const { totalCheckedCartAmount } = useCartContext()
  const {
    orderAddress,
    handleSelectAddress,
    addresses,
    shippingMethod,
    setShippingMethod,
    shippingFee,
    note,
    setNote
  } = useCheckoutContext()

  const [isSelectingAddress, setIsSelectingAddress] = React.useState<boolean>(false)

  return (
    <React.Fragment>
      {totalCheckedCartAmount > 0 ? (
        <React.Fragment>
          <div className='mt-6 space-y-8'>
            {/* Thông tin người nhận hàng */}
            <div className='space-y-4'>
              <div className='flex justify-between items-center space-x-10'>
                <h3>Thông tin người nhận hàng</h3>
                <Button variant='outline' size='sm' onClick={() => setIsSelectingAddress(true)}>
                  Thay đổi
                </Button>
              </div>
              {/* Đã có địa chỉ nhận hàng */}
              {orderAddress && (
                <div>
                  <div
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)'
                    }}
                    className='h-[3px]'
                  />
                  <div className='border border-t-0 rounded-b-md p-4'>
                    <AddressItem address={orderAddress} />
                  </div>
                </div>
              )}
              {/* Chưa có địa chỉ nhận hàng */}
              {!orderAddress && <div className='text-sm text-destructive'>Chưa có địa chỉ nhận hàng</div>}
            </div>
            {/* Ghi chú đơn hàng */}
            <div className='grid gap-2'>
              <Label>Ghi chú đơn hàng (không bắt buộc)</Label>
              <Input
                value={note}
                placeholder='Nhập ghi chú cho đơn hàng của bạn'
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            {/* Phương thức vận chuyển */}
            <div className='grid gap-4'>
              <Label>Phương thức vận chuyển</Label>
              <RadioGroup
                defaultValue={shippingMethod.toString()}
                onValueChange={(value) => setShippingMethod(Number(value))}
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value={ShippingMethod.Normal.toString()} id='normal' />
                  <Label htmlFor='normal'>Bình thường</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value={ShippingMethod.Fast.toString()} id='fast' />
                  <Label htmlFor='fast'>Giao nhanh</Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Label>Phí vận chuyển</Label>
                <div>{formatCurrency(shippingFee)}&#8363;</div>
              </div>
              <div className='flex justify-between items-center'>
                <Label>Tổng tiền</Label>
                <div className='text-highlight font-semibold text-2xl'>
                  {formatCurrency(totalCheckedCartAmount + shippingFee)}&#8363;
                </div>
              </div>
            </div>
            <div
              className={cn({
                'cursor-not-allowed': totalCheckedCartAmount === 0
              })}
            >
              <div
                className={cn({
                  'pointer-events-none': totalCheckedCartAmount === 0
                })}
              >
                <Button asChild size='lg' className='w-full bg-highlight uppercase'>
                  <Link href={PATH.CART_ORDER_PREVIEW}>Xem lại đơn hàng</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Chọn địa chỉ nhận hàng */}
          <Dialog open={isSelectingAddress} onOpenChange={setIsSelectingAddress}>
            <DialogContent className='max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Chọn địa chỉ nhận hàng</DialogTitle>
                <DialogDescription>
                  Vui lòng chọn địa chỉ nhận hàng cho đơn hàng của bạn. Bạn cũng có thể thêm địa chỉ mới nếu cần.
                </DialogDescription>
              </DialogHeader>
              {/* Danh sách địa chỉ */}
              {addresses.length > 0 && (
                <div className='space-y-2'>
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      role='button'
                      className={cn('border-2 rounded-md p-4', {
                        'border-main dark:border-main-foreground bg-main/5 dark:bg-main-foreground/5':
                          orderAddress?._id === address._id
                      })}
                      onClick={() =>
                        handleSelectAddress({
                          address,
                          onSuccess: () => {
                            setIsSelectingAddress(false)
                          }
                        })
                      }
                    >
                      <AddressItem address={address} />
                    </div>
                  ))}
                </div>
              )}
              {/* Thêm một địa chỉ nhận hàng mới */}
              <div className='flex justify-end'>
                <CreateAddressButton
                  onCreateSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['get-my-addresses'] })
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </React.Fragment>
      ) : (
        <CartEmpty />
      )}
    </React.Fragment>
  )
}
