import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { baseOpenGraph } from '@/app/shared-metadata'
import { Toaster } from '@/components/ui/sonner'
import AppProvider from '@/providers/app.provider'
import CartProvider from '@/providers/cart.provider'
import TanstackQueryProvider from '@/providers/tanstack-query.provider'
import ThemeProvider from '@/providers/theme.provider'
import './globals.css'

const fontSans = Space_Grotesk({
  subsets: ['vietnamese']
})

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Mua Hàng Nhanh'
  },
  description:
    'Mua Hàng Nhanh - Thương hiệu hàng đầu về TMĐT chính hãng, giá tốt. Giao hàng nhanh toàn quốc. Đổi trả dễ dàng. Mua sắm ngay hôm nay!',
  openGraph: baseOpenGraph
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${fontSans.className} antialiased`}>
        <TanstackQueryProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <AppProvider>
              <CartProvider>
                {children}
                <Toaster richColors position='top-center' />
                <NextTopLoader showSpinner={false} shadow={false} />
              </CartProvider>
            </AppProvider>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
