import { OrderStatus } from '@/constants/enum'
import http from '@/lib/http'
import {
  CreateOrderReqBody,
  CreateOrderResponse,
  GetOrderEventsResponse,
  GetOrderResponse,
  GetOrdersReqQuery,
  GetOrdersResponse
} from '@/types/orders.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const ordersApis = {
  createOrder(body: CreateOrderReqBody) {
    return http.post<CreateOrderResponse>('/orders', body)
  },

  getMyOrderFromNextServerToServer({ query, accessToken }: { query?: GetOrdersReqQuery; accessToken: string }) {
    const params = new URLSearchParams(query as Record<string, string>)
    return http.get<GetOrdersResponse>(`/orders/me?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getAllOrdersFromNextServerToServer({ query, accessToken }: { query?: GetOrdersReqQuery; accessToken: string }) {
    const params = new URLSearchParams(query as Record<string, string>)
    return http.get<GetOrdersResponse>(`/orders/all?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  cancelOrder(orderId: string) {
    return http.post<OnlyMessageResponse>(`/orders/${orderId}/cancel`, {
      status: OrderStatus.Cancel
    })
  },

  getOrderfromNextServerToServer({ orderId, accessToken }: { orderId: string; accessToken: string }) {
    return http.get<GetOrderResponse>(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  createOrderEvent({ orderId, content }: { orderId: string; content: string }) {
    return http.post<OnlyMessageResponse>(`/orders/${orderId}/events`, { content })
  },

  getOrderEventsFromNextClientToServer(orderId: string) {
    return http.get<GetOrderEventsResponse>(`/orders/${orderId}/events`)
  },

  getOrderEventsFromNextServerToServer({ orderId, accessToken }: { orderId: string; accessToken: string }) {
    return http.get<GetOrderEventsResponse>(`/orders/${orderId}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  deleteOrderEvent(orderEventId: string) {
    return http.delete<OnlyMessageResponse>(`/orders/events/${orderEventId}`, {})
  },

  updateOrder({ orderId, status }: { orderId: string; status: OrderStatus }) {
    return http.put<OnlyMessageResponse>(`/orders/${orderId}`, { status })
  }
} as const

export default ordersApis
