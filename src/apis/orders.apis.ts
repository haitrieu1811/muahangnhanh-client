import http from '@/lib/http'
import { CreateOrderReqBody, CreateOrderResponse } from '@/types/orders.types'

const ordersApis = {
  createOrder(body: CreateOrderReqBody) {
    return http.post<CreateOrderResponse>('/orders', body)
  }
} as const

export default ordersApis
