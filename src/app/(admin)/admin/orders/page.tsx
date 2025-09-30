import { cookies } from 'next/headers'

import ordersApis from '@/apis/orders.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import OrderActions from '@/app/(admin)/admin/orders/order-actions'
import ORDER_BADGES from '@/components/order-badges'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { dateDistance } from '@/lib/utils'
import { OrderType } from '@/types/orders.types'

export default async function AdminOrdersPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let orders: OrderType[] = []
  let totalOrders: number = 0

  try {
    const res = await ordersApis.getAllOrdersFromNextServerToServer({
      accessToken
    })
    orders = res.payload.data.orders
    totalOrders = res.payload.data.pagination.totalRows
  } catch {}

  return (
    <div className='space-y-10'>
      <PageTitle title='Đơn hàng' subTitle={totalOrders.toString()} />
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đặt lúc</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.address.fullName}</TableCell>
                  <TableCell>{order.address.phoneNumber}</TableCell>
                  <TableCell>{order.address.province.name}</TableCell>
                  <TableCell>{ORDER_BADGES[order.status]}</TableCell>
                  <TableCell>{dateDistance(order.createdAt)}</TableCell>
                  <TableCell>{order.totalItems}</TableCell>
                  <TableCell className='font-semibold'>
                    {(order.totalAmount + order.shippingFee - order.totalDiscount).toLocaleString()}&#8363;
                  </TableCell>
                  <TableCell className='text-right'>
                    <OrderActions orderId={order._id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
