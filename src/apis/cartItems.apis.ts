import http from '@/lib/http'
import { OnlyMessageResponse } from '@/types/utils.types'

const cartItemsApis = {
  addToCart({ productId, quantity }: { productId: string; quantity: number }) {
    return http.post<OnlyMessageResponse>(`/cart-items/add/product/${productId}`, { quantity })
  }
} as const

export default cartItemsApis
