'use client'

import { Bell, Handbag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import HeaderCart from '@/app/(shop)/_components/header/cart'
import HeaderNotifications from '@/app/(shop)/_components/header/notifications'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import PATH from '@/constants/path'
import useLogout from '@/hooks/use-logout'
import { User } from '@/types/users.types'

export default function HeaderAccount({ user }: { user: User | null }) {
  const { handleLogout } = useLogout()

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
          <div className='flex space-x-1'>
            {/* Thông báo */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>
                  <Bell />
                  Thông báo
                  <Badge variant='destructive' className='h-5 min-w-5 rounded-full px-1 tabular-nums'>
                    99
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-[400px] p-0'>
                <HeaderNotifications />
              </PopoverContent>
            </Popover>
            {/* Giỏ hàng */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>
                  <Handbag />
                  Giỏ hàng
                  <Badge variant='destructive' className='h-5 min-w-5 rounded-full px-1 tabular-nums'>
                    99
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='p-0 w-[400px]'>
                <HeaderCart />
              </PopoverContent>
            </Popover>
          </div>
          {/* Tài khoản */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.fullName} className='object-cover' />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={PATH.ACCOUNT}>Tài khoản</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </React.Fragment>
  )
}
