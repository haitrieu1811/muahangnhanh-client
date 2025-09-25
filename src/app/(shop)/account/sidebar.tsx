'use client'

import { Key, MapPin, NotepadText, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { cn } from '@/lib/utils'

const pages = [
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
  }
] as const

export default function AccountSidebar() {
  const pathname = usePathname()
  return (
    <aside className='w-[240px] border rounded-md p-1 space-y-1 bg-card sticky top-18'>
      {pages.map((page) => (
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
      ))}
    </aside>
  )
}
