'use client'

import { CheckedState } from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

import ordersApis from '@/apis/orders.apis'
import { CartContext } from '@/app/(shop)/cart'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShippingMethod } from '@/constants/enum'
import useAppContext from '@/hooks/use-app-context'
import { cn, formatAddress } from '@/lib/utils'

export default function OrderPreview() {
  const queryClient = useQueryClient()

  const { orderAddress, note, shippingMethod, shippingFee, setStep } = React.useContext(CartContext)
  const { checkedCartItems, totalCheckedCartAmount, totalCheckoutQuantity } = useAppContext()

  const [isConfirmed, setIsConfirmed] = React.useState<CheckedState>(false)

  const createOrderMutation = useMutation({
    mutationKey: ['create-order'],
    mutationFn: ordersApis.createOrder,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      setStep('success')
      queryClient.invalidateQueries({ queryKey: ['get-my-cart'] })
    }
  })

  const handleCheckout = () => {
    if (!orderAddress || !isConfirmed) return
    createOrderMutation.mutate({
      addressId: orderAddress._id,
      items: checkedCartItems.map((cartItem) => cartItem._id),
      note,
      shippingMethod,
      shippingFee,
      totalAmount: totalCheckedCartAmount + shippingFee,
      totalItems: totalCheckoutQuantity
    })
  }

  return (
    <div className='mt-4 space-y-8'>
      <h3 className='mb-2'>Thông tin đơn hàng</h3>
      <Table className='border'>
        <TableBody>
          <TableRow>
            <TableHead>Tên khách hàng</TableHead>
            <TableCell>{orderAddress?.fullName}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Số điện thoại</TableHead>
            <TableCell>{orderAddress?.phoneNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Địa chỉ nhận hàng</TableHead>
            <TableCell>{orderAddress && formatAddress(orderAddress)}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Ghi chú đơn hàng</TableHead>
            <TableCell>{note}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Phương thức vận chuyển</TableHead>
            <TableCell>{shippingMethod === ShippingMethod.Normal ? 'Vận chuyển thường' : 'Vận chuyển nhanh'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <h3 className='mb-2'>Sản phẩm mua</h3>
      <Table className='border table-fixed'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-1/2'>Sản phẩm</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Thành tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checkedCartItems.map((cartItem) => (
            <TableRow key={cartItem._id}>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <Image
                    width={40}
                    height={40}
                    src={cartItem.product.thumbnail}
                    alt={cartItem.product.name}
                    className='w-10 h-10 object-cover rounded-md'
                  />
                  <span className='line-clamp-1'>{cartItem.product.name}</span>
                </div>
              </TableCell>
              <TableCell>{cartItem.unitPriceAfterDiscount.toLocaleString()}&#8363;</TableCell>
              <TableCell>{cartItem.quantity}</TableCell>
              <TableCell>{(cartItem.unitPriceAfterDiscount * cartItem.quantity).toLocaleString()}&#8363;</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className='text-right font-semibold'>
              Tổng cộng:
            </TableCell>
            <TableCell className='font-semibold text-right'>{totalCheckedCartAmount.toLocaleString()}&#8363;</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className='text-right font-semibold'>
              Phí vận chuyển:
            </TableCell>
            <TableCell className='font-semibold text-right'>{shippingFee.toLocaleString()}&#8363;</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className='text-right font-semibold'>
              Giảm giá:
            </TableCell>
            <TableCell className='font-semibold text-right'>-0&#8363;</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className='text-right font-semibold'>
              Tổng tiền thanh toán:
            </TableCell>
            <TableCell className='font-semibold text-main dark:text-main-foreground text-right'>
              {(totalCheckedCartAmount + shippingFee).toLocaleString()}&#8363;
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='order-confirmation'
          checked={isConfirmed}
          onCheckedChange={(checkState) => setIsConfirmed(checkState)}
        />
        <Label htmlFor='order-confirmation'>Tôi đã kiểm tra kỹ thông tin đơn hàng và đồng ý tiếp tục đặt hàng</Label>
      </div>
      <div
        className={cn({
          'cursor-not-allowed': !isConfirmed
        })}
      >
        <Button
          size='lg'
          disabled={!isConfirmed || createOrderMutation.isPending}
          className='uppercase w-full bg-highlight'
          onClick={handleCheckout}
        >
          {createOrderMutation.isPending && <Loader2 className='animate-spin' />}
          Đặt hàng
        </Button>
      </div>
    </div>
  )
}
