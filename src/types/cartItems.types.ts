import { CartItemStatus } from '@/constants/enum'
import { SuccessResponse } from '@/types/utils.types'

export type OriginalCartItem = {
  _id: string
  userId: string
  productId: string
  unitPrice: number
  unitPriceAfterDiscount: number
  quantity: number
  status: CartItemStatus
  createdAt: string
  updatedAt: string
}

export type CartItemType = {
  _id: string
  product: {
    _id: string
    thumbnail: string
    name: string
    price: number
    priceAfterDiscount: number
    isFlashSale: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  unitPrice: number
  unitPriceAfterDiscount: number
  quantity: number
  createdAt: string
  updatedAt: string
}

export type GetMyCartResponse = SuccessResponse<{
  totalItems: number
  totalAmount: number
  cartItems: CartItemType[]
}>

export type AddProductToCartResponse = SuccessResponse<{
  cartItem: OriginalCartItem
}>
