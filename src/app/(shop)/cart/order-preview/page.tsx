import { Metadata } from 'next'

import OrderPreview from '@/app/(shop)/cart/order-preview/order-preview'

export const metadata: Metadata = {
  title: 'Xem lại đơn hàng'
}

export default function CardOrderPreviewPage() {
  return <OrderPreview />
}
