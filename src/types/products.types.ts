import { ProductCategoryStatus } from '@/constants/enum'
import { CreateProductCategorySchema, CreateProductSchema } from '@/rules/products.rules'
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
  isFlashSale: boolean
  isActive: boolean
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
  isFlashSale?: boolean
  isActive?: boolean
}

export type CreateProductResponse = SuccessResponse<{
  products: ProductType[]
  pagination: PaginationType
}>

export type GetProductResponse = SuccessResponse<{
  product: ProductType
}>

export type CreateProductReqBody = Omit<CreateProductSchema, 'price' | 'priceAfterDiscount' | 'status'> & {
  price: number
  priceAfterDiscount?: number
  thumbnail: string // ID hình ảnh
  photos?: string[]
}

export type ProductCategoryType = {
  _id: string
  name: string
  description: string
  thumbnail: string
  thumbnailId: string
  status: ProductCategoryStatus
  createdAt: string
  updatedAt: string
}

export type GetProductCategoriesResponse = SuccessResponse<{
  productCategories: ProductCategoryType[]
  pagination: PaginationType
}>

export type CreateProductCategoryResponse = SuccessResponse<{
  productCategory: {
    _id: string
    userId: string
    thumbnail: string
    name: string
    description: string
    status: ProductCategoryStatus
    createdAt: string
    updatedAt: string
  }
}>

export type CreateProductCategoryReqBody = CreateProductCategorySchema & { thumbnail: string }
