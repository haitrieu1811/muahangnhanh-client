import { Metadata } from 'next'

import Cart from '@/app/(shop)/cart'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Giỏ hàng'
}

export default function CartPage() {
  return (
    <div className='container py-4'>
      <Card className='max-w-screen w-[600px] mx-auto'>
        <CardContent>
          <Cart />
        </CardContent>
      </Card>
    </div>
  )
}
