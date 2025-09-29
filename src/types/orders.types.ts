import { AddressType, CartItemStatus, OrderStatus, ShippingMethod } from '@/constants/enum'
import { PaginationReqQuery, PaginationType, SuccessResponse } from '@/types/utils.types'

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

export type OrderType = {
  _id: string
  address: {
    _id: string
    fullName: string
    phoneNumber: string
    detail: string
    type: AddressType
    isDefault: boolean
    createdAt: string
    updatedAt: string
    province: {
      _id: string
      name: string
      prefix: string
      createdAt: string
      updatedAt: string
    }
    commune: {
      _id: string
      name: string
      prefix: string
      createdAt: string
      updatedAt: string
    }
  }
  items: {
    _id: string
    unitPrice: number
    unitPriceAfterDiscount: number
    quantity: number
    status: CartItemStatus
    createdAt: string
    updatedAt: string
    product: {
      _id: string
      thumbnail: string
      name: string
      categoryId: string
      price: number
      priceAfterDiscount: number
      createdAt: string
      updatedAt: string
    }
  }[]
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

export type GetMyOrdersResponse = SuccessResponse<{
  orders: OrderType[]
  pagination: PaginationType
}>

export type GetOrdersReqQuery = PaginationReqQuery & {
  status?: OrderStatus
}
