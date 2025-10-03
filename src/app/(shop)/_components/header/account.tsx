'use client'

import { Bell, Handbag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import HeaderCartPopover from '@/app/(shop)/_components/header/cart-popover'
import HeaderNotificationsPopover from '@/app/(shop)/_components/header/notifications-popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserRole } from '@/constants/enum'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useLogout from '@/hooks/use-logout'
import { jwtDecode } from '@/lib/utils'
import { User } from '@/types/users.types'

export default function HeaderAccount({ user, accessToken }: { user: User | null; accessToken: string }) {
  const { handleLogout } = useLogout()
  const { totalCartItems } = useAppContext()

  return (
    <React.Fragment>
      {/* Chưa đăng nhập */}
      {!user && (
        <div className='flex items-center space-x-4'>
          <Button asChild variant='link' className='p-0'>
            <Link href={PATH.REGISTER}>Đăng ký</Link>
          </Button>
          <Button asChild variant='link' className='p-0'>
            <Link href={PATH.LOGIN}>Đăng nhập</Link>
          </Button>
        </div>
      )}

      {/* Đã đăng nhập */}
      {user && (
        <div className='flex items-center space-x-4'>
          <div className='flex space-x-2'>
            {/* Thông báo */}
            <HeaderNotificationsPopover>
              <Button variant='outline'>
                <Bell />
                Thông báo
                <Badge className='h-5 min-w-5 rounded-full px-1 tabular-nums bg-main dark:bg-main-foreground'>99</Badge>
              </Button>
            </HeaderNotificationsPopover>
            {/* Giỏ hàng */}
            <HeaderCartPopover>
              <Button variant='outline'>
                <Handbag />
                Giỏ hàng
                {totalCartItems > 0 && (
                  <Badge className='h-5 min-w-5 rounded-full px-1 tabular-nums bg-main dark:bg-main-foreground'>
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </Badge>
                )}
              </Button>
            </HeaderCartPopover>
          </div>
          {/* Tài khoản */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.fullName} className='object-cover' />
                <AvatarFallback>
                  {user.fullName[0].toUpperCase()}
                  {user.fullName[1].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={PATH.ACCOUNT}>Tài khoản</Link>
              </DropdownMenuItem>
              {jwtDecode(accessToken).userRole === UserRole.Admin && (
                <DropdownMenuItem asChild>
                  <Link href={PATH.ADMIN}>Trang quản trị</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={PATH.ACCOUNT_ORDERS}>Đơn hàng của tôi</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </React.Fragment>
  )
}
