import http from '@/lib/http'
import { CreateProductCategorySchema } from '@/rules/products.rules'
import {
  CreateProductCategoryResponse,
  CreateProductReqBody,
  CreateProductResponse,
  GetProductCategoriesResponse,
  GetProductResponse,
  GetProductsReqQuery,
  GetProductsResponse
} from '@/types/products.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const productsApis = {
  getAllProducts({ query, accessToken }: { query: GetProductsReqQuery; accessToken: string }) {
    const searchParams = new URLSearchParams(query as Record<string, string>)
    return http.get<GetProductsResponse>(`/products/all?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  createProduct(body: CreateProductReqBody) {
    return http.post<CreateProductResponse>('/products', body)
  },

  getProduct(id: string) {
    return http.get<GetProductResponse>(`/products/${id}`)
  },

  updateProduct({ body, id }: { body: CreateProductReqBody; id: string }) {
    return http.put<GetProductResponse>(`/products/${id}`, body)
  },

  deleteProduct(id: string) {
    return http.delete<OnlyMessageResponse>(`/products/${id}`, {})
  },

  getProductCategories() {
    return http.get<GetProductCategoriesResponse>('/product-categories')
  },

  createProductCategory(body: CreateProductCategorySchema & { thumbnail: string }) {
    return http.post<CreateProductCategoryResponse>('/product-categories', body)
  }
} as const

export default productsApis
