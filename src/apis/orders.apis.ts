import { OrderStatus } from '@/constants/enum'
import http from '@/lib/http'
import { CreateOrderReqBody, CreateOrderResponse, GetMyOrdersResponse, GetOrdersReqQuery } from '@/types/orders.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const ordersApis = {
  createOrder(body: CreateOrderReqBody) {
    return http.post<CreateOrderResponse>('/orders', body)
  },

  getMyOrderFromNextServerToServer({ query, accessToken }: { query?: GetOrdersReqQuery; accessToken: string }) {
    const params = new URLSearchParams(query as Record<string, string>)
    return http.get<GetMyOrdersResponse>(`/orders/me?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  cancelOrder(orderId: string) {
    return http.post<OnlyMessageResponse>(`/orders/${orderId}/cancel`, {
      status: OrderStatus.Cancel
    })
  }
} as const

export default ordersApis
