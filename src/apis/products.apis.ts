import http from '@/lib/http'
import { GetProductsReqQuery, GetProductsResponse } from '@/types/products.types'

const productsApis = {
  getAllProducts({ query, accessToken }: { query: GetProductsReqQuery; accessToken: string }) {
    const searchParams = new URLSearchParams(query as Record<string, string>)
    return http.get<GetProductsResponse>(`/products/all?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
} as const

export default productsApis
