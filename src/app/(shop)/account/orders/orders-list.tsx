'use client'

import { useMutation } from '@tanstack/react-query'
import { CheckCheck, CheckCircle2, EllipsisVertical, Loader, Loader2, Truck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import ordersApis from '@/apis/orders.apis'
import ORDER_BADGES from '@/components/order-badges'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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

  const cancelOrderMutation = useMutation({
    mutationKey: ['cancel-order'],
    mutationFn: ordersApis.cancelOrder,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    }
  })

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
                <CardTitle>{ORDER_BADGES[order.status]}</CardTitle>
                <CardDescription>#{order.code}</CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size='icon' variant='outline'>
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link href={PATH.ACCOUNT_ORDERS_DETAIL(order._id)}>Chi tiết đơn</Link>
                      </DropdownMenuItem>
                      {order.status === OrderStatus.Waiting && (
                        <DropdownMenuItem
                          disabled={cancelOrderMutation.isPending && cancelOrderMutation.variables === order._id}
                          className='text-destructive hover:text-destructive!'
                          onClick={() => cancelOrderMutation.mutate(order._id)}
                        >
                          {cancelOrderMutation.isPending && cancelOrderMutation.variables === order._id && (
                            <Loader2 className='animate-spin' />
                          )}
                          Hủy đơn
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
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
              </CardContent>
              <CardFooter className='justify-end space-x-2'>
                <div className='text-sm'>Tổng thanh toán:</div>
                <div className='text-highlight font-semibold'>
                  {(order.totalAmount + order.shippingFee - order.totalDiscount).toLocaleString()}&#8363;
                </div>
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
