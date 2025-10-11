'use client'

import { Key, LogOut, LucideIcon, MapPin, NotepadText, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import useLogout from '@/hooks/use-logout'
import { cn } from '@/lib/utils'

export default function AccountSidebar() {
  const pathname = usePathname()

  const { handleLogout } = useLogout()

  const pagesRef = React.useRef<
    {
      url: string
      icon: LucideIcon
      name: string
      onClick?: () => void
    }[]
  >([
    {
      url: PATH.ACCOUNT,
      icon: UserRound,
      name: 'Tài khoản'
    },
    {
      url: PATH.ACCOUNT_CHANGE_PASSWORD,
      icon: Key,
      name: 'Đổi mật khẩu'
    },
    {
      url: PATH.ACCOUNT_ADDRESSES,
      icon: MapPin,
      name: 'Sổ địa chỉ'
    },
    {
      url: PATH.ACCOUNT_ORDERS,
      icon: NotepadText,
      name: 'Đơn hàng'
    },
    {
      url: '',
      icon: LogOut,
      name: 'Đăng xuất',
      onClick: handleLogout
    }
  ])

  return (
    <aside className='w-full lg:w-[240px] border lg:rounded-md p-1 space-y-1 bg-card lg:sticky lg:top-18'>
      {pagesRef.current.map((page) => {
        if (page.onClick) {
          return (
            <Button key={page.url} variant='ghost' className='w-full justify-start' onClick={page.onClick}>
              <page.icon />
              <span>{page.name}</span>
            </Button>
          )
        }
        return (
          <Button asChild key={page.url} variant='ghost'>
            <Link
              href={page.url}
              className={cn('w-full justify-start', {
                'text-highlight pointer-events-none': page.url === pathname
              })}
            >
              <page.icon />
              <span>{page.name}</span>
            </Link>
          </Button>
        )
      })}
    </aside>
  )
}
