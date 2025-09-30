import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ordersApis from '@/apis/orders.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import CreateEvent from '@/app/(admin)/admin/orders/[id]/order-events'
import UpdateStatus from '@/app/(admin)/admin/orders/[id]/update-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { ShippingMethod } from '@/constants/enum'
import PATH from '@/constants/path'
import { dateDistance, formatAddress } from '@/lib/utils'
import { Address } from '@/types/addresses.types'
import { OrderType } from '@/types/orders.types'

export default async function AdminOrderDetailPage({
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

  try {
    const res = await ordersApis.getOrderfromNextServerToServer({
      orderId: id,
      accessToken
    })
    order = res.payload.data.order
  } catch {}

  if (!order) return null

  return (
    <div className='grid gap-10'>
      <PageTitle title={order.code} subTitle={`Cập nhật ${dateDistance(order.updatedAt)}`} />
      <div className='grid gap-4'>
        {/* Cập nhật trạng thái */}
        <UpdateStatus defaultValue={order.status} orderId={order._id} />
        {/* Thông tin đơn hàng - Dòng thời gian */}
        <div className='flex items-start space-x-4'>
          {/* Thông tin đơn hàng */}
          <Card className='basis-1/2'>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className='border'>
                <TableBody>
                  <TableRow>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableCell>{order.address.fullName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Số điện thoại</TableHead>
                    <TableCell>{order.address.phoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Địa chỉ nhận hàng</TableHead>
                    <TableCell>{formatAddress(order.address as Address)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Ghi chú đơn hàng</TableHead>
                    <TableCell>{order.note}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Phương thức vận chuyển</TableHead>
                    <TableCell>
                      {order.shippingMethod === ShippingMethod.Normal ? 'Vận chuyển thường' : 'Vận chuyển nhanh'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Dòng thời gian */}
          <div className='basis-1/2'>
            <CreateEvent orderId={order._id} />
          </div>
        </div>
        {/* Sản phẩm đặt mua */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm đặt mua</CardTitle>
          </CardHeader>
          <CardContent className='space-y-8'>
            <div className='space-y-4'>
              {order.items.map((item) => (
                <Link
                  key={item._id}
                  target='_blank'
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
            {/* Tiền thanh toán */}
            <div className='flex flex-col items-end space-y-4 text-sm'>
              <div className='flex items-center space-x-8'>
                <div className='text-muted-foreground'>Tổng sản phẩm</div>
                <div className='text-right w-[160px]'>{order.totalItems} sản phẩm</div>
              </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
