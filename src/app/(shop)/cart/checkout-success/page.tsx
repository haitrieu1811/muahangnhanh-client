import { Metadata } from 'next'

import CartCheckoutSuccess from '@/app/(shop)/cart/checkout-success/checkout-success'

export const metadata: Metadata = {
  title: 'Đặt hàng thành công'
}

export default function CartCheckoutSuccessPage() {
  return <CartCheckoutSuccess />
}
