import { Metadata } from 'next'

import OrderInfo from '@/app/(shop)/cart/order-info/order-info'

export const metadata: Metadata = {
  title: 'Thông tin đặt hàng'
}

export default function CartOrderInfoPage() {
  return <OrderInfo />
}
