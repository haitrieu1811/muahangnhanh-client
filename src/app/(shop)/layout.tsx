import React from 'react'

import ShopFooter from '@/app/(shop)/_components/footer'
import ShopHeader from '@/app/(shop)/_components/header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <ShopHeader />
      <main>{children}</main>
      <ShopFooter />
    </React.Fragment>
  )
}
