'use client'

import { Handbag, Home, Newspaper, Tags, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import PATH from '@/constants/path'
import { cn } from '@/lib/utils'

const PAGES = [
  {
    path: PATH.HOME,
    icon: Home,
    name: 'Trang chủ'
  },
  {
    path: PATH.PRODUCTS,
    icon: Tags,
    name: 'Sản phẩm'
  },
  {
    path: PATH.BLOGS,
    icon: Newspaper,
    name: 'Bài viết'
  },
  {
    path: PATH.CART,
    icon: Handbag,
    name: 'Giỏ hàng'
  },
  {
    path: PATH.ACCOUNT,
    icon: UserRound,
    name: 'Tài khoản'
  }
] as const

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className='fixed bottom-0 inset-x-0 z-10 bg-card h-14 flex lg:hidden border-t-2 border-main dark:border-main-foreground space-x-2'>
      {PAGES.map((page) => (
        <Link
          key={page.path}
          href={page.path}
          className={cn('flex-auto flex flex-col justify-center items-center space-y-2', {
            'text-highlight pointer-events-none': page.path === pathname
          })}
        >
          <page.icon className='stroke-1 size-5 shrink-0' />
          <span className='text-center text-xs'>{page.name}</span>
        </Link>
      ))}
    </nav>
  )
}
