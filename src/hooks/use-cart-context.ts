import React from 'react'

import { CartContext } from '@/providers/cart.provider'

export default function useCartContext() {
  return React.use(CartContext)
}
