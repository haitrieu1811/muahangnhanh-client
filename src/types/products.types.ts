import { ProductStatus } from '@/constants/enum'
import { CreateProductSchema } from '@/rules/products.rules'
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

export type CreateProductResponse = SuccessResponse<{
  products: ProductType[]
  pagination: PaginationType
}>

export type CreateProductBody = Omit<CreateProductSchema, 'price' | 'priceAfterDiscount' | 'status'> & {
  price: number
  priceAfterDiscount?: number
  thumbnail: string // ID hình ảnh
  photos?: string[]
  status?: ProductStatus
}
