import http from '@/lib/http'
import { CreateOrderReqBody, CreateOrderResponse, GetMyOrdersResponse, GetOrdersReqQuery } from '@/types/orders.types'

const ordersApis = {
  createOrder(body: CreateOrderReqBody) {
    return http.post<CreateOrderResponse>('/orders', body)
  },

  getMyOrderFromNextServerToServer({ query, accessToken }: { query?: GetOrdersReqQuery; accessToken: string }) {
    const params = new URLSearchParams(query as Record<string, string>)
    console.log(params.toString())

    return http.get<GetMyOrdersResponse>(`/orders/me?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
} as const

export default ordersApis
