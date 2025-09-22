import { ProductStatus } from '@/constants/enum'
import { PaginationReqQuery, PaginationType, SuccessResponse } from '@/types/utils.types'

export type ProductType = {
  _id: string
  thumbnail: {
    _id: string
    url: string
  }
  photos: {
    _id: string
    url: string
  }[]
  name: string
  description: string
  starPoints: number | null
  category: {
    _id: string
    thumbnail: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
  }
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  price: number
  priceAfterDiscount: number
  status: ProductStatus
  categoryId: string
  createdAt: string
  updatedAt: string
}

export type GetProductsResponse = SuccessResponse<{
  products: ProductType[]
  pagination: PaginationType
}>

export type GetProductsReqQuery = PaginationReqQuery & {
  name?: string
}
