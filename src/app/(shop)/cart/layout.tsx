import React from 'react'

import CartStep from '@/app/(shop)/cart/step'
import { Card, CardContent } from '@/components/ui/card'
import CheckoutProvider from '@/providers/checkout.provider'

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutProvider>
      <div className='container py-4'>
        <Card className='max-w-screen w-[600px] mx-auto'>
          <CardContent>
            <div className='space-y-2'>
              <CartStep />
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    </CheckoutProvider>
  )
}
