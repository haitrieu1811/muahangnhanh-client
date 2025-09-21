'use client'

import { BadgeCheck, ChevronsUpDown, LogOut, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useIsClient from '@/hooks/use-is-client'
import useLogout from '@/hooks/use-logout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function NavUser() {
  const isClient = useIsClient()
  const { isMobile } = useSidebar()
  const { user: loggedUser } = useAppContext()
  const { handleLogout } = useLogout()

  if (!loggedUser || !isClient) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='rounded-lg'>
                <AvatarImage src={loggedUser.avatar} alt={loggedUser.fullName} />
                <AvatarFallback>
                  {loggedUser.fullName[0].toUpperCase()}
                  {loggedUser.fullName[1].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{loggedUser.fullName}</span>
                <span className='truncate text-xs'>{loggedUser.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='rounded-lg'>
                  <AvatarImage src={loggedUser.avatar} alt={loggedUser.fullName} />
                  <AvatarFallback>
                    {loggedUser.fullName[0].toUpperCase()}
                    {loggedUser.fullName[1].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{loggedUser?.fullName}</span>
                  <span className='truncate text-xs'>{loggedUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={PATH.ADMIN_ME}>
                  <BadgeCheck />
                  Tài khoản
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
