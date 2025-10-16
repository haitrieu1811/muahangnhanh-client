'use client'

import { Handbag } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { UserRole } from '@/constants/enum'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useCartContext from '@/hooks/use-cart-context'
import useIsClient from '@/hooks/use-is-client'
import useLogout from '@/hooks/use-logout'
import { getAccessTokenFromLS } from '@/lib/storage'
import { jwtDecode } from '@/lib/utils'

export default function HeaderAccount() {
  const accessToken = getAccessTokenFromLS()

  const isClient = useIsClient()
  const { handleLogout } = useLogout()
  const { totalCartItems } = useCartContext()
  const { isAuthenticated, user } = useAppContext()

  return (
    <React.Fragment>
      {/* Chưa đăng nhập */}
      {!isAuthenticated && isClient && (
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
      {isAuthenticated && isClient && user && (
        <div className='flex items-center space-x-4'>
          <div className='flex space-x-2'>
            {/* Thông báo */}
            <HeaderNotificationsPopover />
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
              {accessToken && jwtDecode(accessToken)?.userRole === UserRole.Admin && (
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
      {!isClient && <Skeleton className='w-[200px] h-9' />}
    </React.Fragment>
  )
}
