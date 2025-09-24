'use client'

import { Bell, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import PATH from '@/constants/path'
import useLogout from '@/hooks/use-logout'
import { User } from '@/types/users.types'
import { Badge } from '@/components/ui/badge'

export default function HeaderUser({ user }: { user: User | null }) {
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
            <Button variant='outline'>
              <Bell />
              Thông báo
              <Badge className='h-5 min-w-5 rounded-full px-1 tabular-nums' variant='destructive'>
                99
              </Badge>
            </Button>
            <Button variant='outline'>
              <ShoppingCart />
              Giỏ hàng
              <Badge className='h-5 min-w-5 rounded-full px-1 tabular-nums' variant='destructive'>
                99
              </Badge>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.fullName} className='object-cover' />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tài khoản</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </React.Fragment>
  )
}
