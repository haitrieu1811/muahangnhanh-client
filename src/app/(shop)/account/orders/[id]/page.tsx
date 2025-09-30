import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ordersApis from '@/apis/orders.apis'
import OrderDetailBackButton from '@/app/(shop)/account/orders/[id]/back-button'
import ORDER_BADGES from '@/components/order-badges'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import { dateDistance, formatAddress } from '@/lib/utils'
import { Address } from '@/types/addresses.types'
import { OrderEventType, OrderType } from '@/types/orders.types'
import OrderEvents from '@/components/order-events'

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let order: OrderType | null = null
  let orderEvents: OrderEventType[] = []
  let totalOrderEvents: number = 0

  try {
    const res = await ordersApis.getOrderfromNextServerToServer({
      accessToken,
      orderId: id
    })
    order = res.payload.data.order
  } catch {}

  if (!order) return null

  try {
    const res = await ordersApis.getOrderEventsFromNextServerToServer({
      accessToken,
      orderId: order._id
    })
    orderEvents = res.payload.data.orderEvents
    totalOrderEvents = res.payload.data.totalOrderEvents
  } catch {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <OrderDetailBackButton />
        </CardTitle>
        <CardDescription>Cập nhật {dateDistance(order.updatedAt)}</CardDescription>
        <CardAction>
          <div className='flex flex-col items-end space-y-2'>
            <div className='text-muted-foreground text-sm'>Mã đơn hàng #{order.code}</div>
            {ORDER_BADGES[order.status]}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)'
          }}
          className='h-[3px] mb-8'
        />
        <div className='space-y-8'>
          {/* Thông tin nhận hàng - Dòng thời gian */}
          <div className='grid grid-cols-12 gap-8'>
            {/* Thông tin nhận hàng */}
            <div className='col-span-4'>
              <h3>Địa chỉ nhận hàng</h3>
              <div className='mt-4 text-sm space-y-2'>
                <div className='font-semibold'>{order.address.fullName}</div>
                <div className='text-muted-foreground'>{order.address.phoneNumber}</div>
                <div className='text-muted-foreground'>{formatAddress(order.address as Address)}</div>
              </div>
            </div>
            {/* Dòng thời gian */}
            <div className='col-span-8 space-y-4'>
              <h3>Dòng thời gian</h3>
              {totalOrderEvents > 0 && <OrderEvents orderEvents={orderEvents} />}
              {totalOrderEvents === 0 && <p className='text-sm'>Chưa có sự kiện nào.</p>}
            </div>
          </div>
          {/* Sản phẩm đặt mua */}
          <div className='space-y-4'>
            {order.items.map((item) => (
              <Link
                key={item._id}
                href={PATH.PRODUCTS_DETAIL({
                  name: item.product.name,
                  id: item.product._id
                })}
                className='flex justify-between items-center space-x-10'
              >
                <div className='flex flex-1 items-center space-x-4'>
                  <Image
                    width={50}
                    height={50}
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className='size-[50px] rounded-md object-cover shrink-0'
                  />
                  <div className='flex-1 text-sm'>
                    <div className='line-clamp-2'>{item.product.name}</div>
                    <div className='text-muted-foreground'>Số lượng: {item.quantity}</div>
                  </div>
                </div>
                <div className='text-right text-sm'>
                  {item.unitPriceAfterDiscount < item.unitPrice ? (
                    <React.Fragment>
                      <div className='text-highlight font-semibold'>
                        {item.unitPriceAfterDiscount.toLocaleString()}&#8363;
                      </div>
                      <div className='text-muted-foreground line-through'>{item.unitPrice.toLocaleString()}&#8363;</div>
                    </React.Fragment>
                  ) : (
                    <div className='text-highlight font-semibold'>{item.unitPrice.toLocaleString()}&#8363;</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {/* Tiền thanh toán */}
          <div className='flex flex-col items-end space-y-4 text-sm'>
            <div className='flex items-center space-x-8'>
              <div className='text-muted-foreground'>Tổng tiền hàng</div>
              <div className='text-right w-[160px]'>{order.totalAmount.toLocaleString()}&#8363;</div>
            </div>
            <div className='flex items-center space-x-8'>
              <div className='text-muted-foreground'>Phí vận chuyển</div>
              <div className='text-right w-[160px]'>{order.shippingFee.toLocaleString()}&#8363;</div>
            </div>
            <div className='flex items-center space-x-8'>
              <div className='text-muted-foreground'>Tổng tiền giảm</div>
              <div className='text-right w-[160px]'>-{order.totalDiscount.toLocaleString()}&#8363;</div>
            </div>
            <div className='flex items-center space-x-8'>
              <div className='text-muted-foreground'>Tổng tiền cần thanh toán</div>
              <div className='text-right w-[160px] font-semibold text-highlight text-xl'>
                {(order.totalAmount + order.shippingFee - order.totalDiscount).toLocaleString()}&#8363;
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
