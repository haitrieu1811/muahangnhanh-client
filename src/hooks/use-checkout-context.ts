import React from 'react'

import { CheckoutContext } from '@/providers/checkout.provider'

export default function useCheckoutContext() {
  return React.use(CheckoutContext)
}
