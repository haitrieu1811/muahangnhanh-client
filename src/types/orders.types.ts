import { OrderStatus, ShippingMethod } from '@/constants/enum'
import { SuccessResponse } from '@/types/utils.types'

export type CreateOrderReqBody = {
  items: string[]
  totalItems: number
  totalAmount: number
  note?: string
  addressId: string
  shippingMethod: ShippingMethod
  shippingFee: number
  totalDiscount?: number
}

export type BasicOrder = {
  _id: string
  userId: string
  items: string[]
  addressId: string
  code: string
  shippingMethod: ShippingMethod
  shippingFee: number
  totalItems: number
  totalAmount: number
  totalDiscount: number
  note: string
  status: OrderStatus
  orderedAt: string
  confirmedAt: null
  shippedAt: null
  canceledAt: null
  succeededAt: null
  ratedAt: null
  createdAt: string
  updatedAt: string
}

export type CreateOrderResponse = SuccessResponse<{
  order: BasicOrder
}>
