'use client'

import { BadgeCheck, BadgeX, Check, CheckCheck, CheckCircle2, Loader, Loader2, Truck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrderStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import { OrderType } from '@/types/orders.types'

const ORDER_STATUSES = [
  { value: '-1', label: 'Tất cả', icon: Loader2 },
  { value: OrderStatus.Waiting.toString(), label: 'Chờ xác nhận', icon: Loader },
  { value: OrderStatus.Confirmed.toString(), label: 'Đã xác nhận', icon: CheckCircle2 },
  { value: OrderStatus.Delivering.toString(), label: 'Đang giao', icon: Truck },
  { value: OrderStatus.Success.toString(), label: 'Đã giao', icon: CheckCheck },
  { value: OrderStatus.Cancel.toString(), label: 'Đã hủy', icon: X }
] as const

const ORDER_BADGES = {
  [OrderStatus.Waiting]: (
    <Badge className='bg-yellow-500'>
      <Loader />
      Chờ xác nhận
    </Badge>
  ),
  [OrderStatus.Confirmed]: (
    <Badge className='bg-pink-500'>
      <Check />
      Đã xác nhận
    </Badge>
  ),
  [OrderStatus.Delivering]: (
    <Badge className='bg-blue-500'>
      <Truck />
      Đang vận chuyển
    </Badge>
  ),
  [OrderStatus.Success]: (
    <Badge className='bg-green-500'>
      <BadgeCheck />
      Thành công
    </Badge>
  ),
  [OrderStatus.Cancel]: (
    <Badge className='bg-red-500'>
      <BadgeX />
      Đã hủy
    </Badge>
  )
} as const

export default function OrdersList({ orders, totalOrders }: { orders: OrderType[]; totalOrders: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get('status')

  const handleFilterByStatus = useDebouncedCallback((status: OrderStatus) => {
    const params = new URLSearchParams(searchParams)
    if (status > -1) {
      params.set('status', status.toString())
    } else {
      params.delete('status')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 500)

  return (
    <Tabs defaultValue={status?.toString() ?? '-1'} onValueChange={(status) => handleFilterByStatus(Number(status))}>
      <TabsList>
        {ORDER_STATUSES.map((orderStatus) => (
          <TabsTrigger key={orderStatus.value} value={orderStatus.value}>
            {orderStatus.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* Danh sách đơn hàng */}
      {totalOrders > 0 && (
        <div className='grid gap-4'>
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <CardTitle>Mã đơn: #{order.code}</CardTitle>
                <CardAction>{ORDER_BADGES[order.status]}</CardAction>
              </CardHeader>
              <CardContent>
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
                            <div className='text-muted-foreground line-through'>
                              {item.unitPrice.toLocaleString()}&#8363;
                            </div>
                          </React.Fragment>
                        ) : (
                          <div className='text-highlight font-semibold'>{item.unitPrice.toLocaleString()}&#8363;</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className='mt-10 flex items-center justify-end space-x-2'>
                  <div>Tổng thanh toán:</div>
                  <div className='text-highlight font-semibold'>{order.totalAmount.toLocaleString()}&#8363;</div>
                </div>
              </CardContent>
              <CardFooter className='justify-end space-x-2'>
                <Button variant='outline' size='sm'>
                  Chi tiết đơn
                </Button>
                {order.status === OrderStatus.Waiting && (
                  <Button variant='destructive' size='sm'>
                    Hủy đơn
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Không tìm thấy đơn hàng nào */}
      {totalOrders === 0 && <p className='mt-4 text-sm'>Không tìm thấy đơn hàng nào.</p>}
    </Tabs>
  )
}
