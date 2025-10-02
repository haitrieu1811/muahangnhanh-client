import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { Toaster } from '@/components/ui/sonner'
import AppProvider from '@/providers/app.provider'
import TanstackQueryProvider from '@/providers/tanstack-query.provider'
import ThemeProvider from '@/providers/theme.provider'
import './globals.css'

const fontSans = Inter({
  subsets: ['vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: {
    template: '%s | Mua Hàng Nhanh',
    default: 'Mua Hàng Nhanh'
  },
  description:
    'Mua Hàng Nhanh - Thương hiệu hàng đầu về TMĐT chính hãng, giá tốt. Giao hàng nhanh toàn quốc. Đổi trả dễ dàng. Mua sắm ngay hôm nay!'
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
              {children}
              <Toaster richColors position='top-center' />
              <NextTopLoader showSpinner={false} shadow={false} />
            </AppProvider>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
