import { Metadata } from 'next'

import CartList from '@/app/(shop)/cart/cart-list'

export const metadata: Metadata = {
  title: 'Giỏ hàng'
}

export default function CartPage() {
  return <CartList />
}
