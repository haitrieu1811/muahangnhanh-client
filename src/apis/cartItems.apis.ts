import http from '@/lib/http'
import { GetMyCartResponse } from '@/types/cartItems.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const cartItemsApis = {
  addToCart({ productId, quantity }: { productId: string; quantity: number }) {
    return http.post<OnlyMessageResponse>(`/cart-items/add/product/${productId}`, { quantity })
  },

  getMyCart() {
    return http.get<GetMyCartResponse>('/cart-items/me')
  },

  updateCartItem({ cartItemId, quantity }: { cartItemId: string; quantity: number }) {
    return http.put<OnlyMessageResponse>(`/cart-items/${cartItemId}`, { quantity })
  },

  deleteCartItems({ cartItemIds }: { cartItemIds: string[] }) {
    return http.delete<OnlyMessageResponse>('/cart-items', { cartItemIds })
  }
} as const

export default cartItemsApis
