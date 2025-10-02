import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

import ordersApis from '@/apis/orders.apis'
import OrdersList from '@/app/(shop)/account/orders/orders-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderType } from '@/types/orders.types'

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi'
}

export default async function AccountOrdersPage({
  searchParams
}: {
  searchParams: Promise<{
    status: string
  }>
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  const _searchParams = await searchParams
  const status = _searchParams.status

  let orders: OrderType[] = []
  let totalOrders: number = 0

  try {
    const configuredQuery = omitBy(
      {
        status: status !== undefined ? Number(status) : undefined
      },
      isUndefined
    )
    const res = await ordersApis.getMyOrderFromNextServerToServer({
      accessToken,
      query: configuredQuery
    })
    orders = res.payload.data.orders
    totalOrders = res.payload.data.pagination.totalRows
  } catch {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Đơn hàng của tôi</CardTitle>
        <CardDescription>Quản lý tất cả đơn hàng của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <OrdersList orders={orders} totalOrders={totalOrders} />
      </CardContent>
    </Card>
  )
}
