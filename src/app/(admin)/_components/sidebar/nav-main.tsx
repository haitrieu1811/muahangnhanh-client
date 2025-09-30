'use client'

import { ChevronRight, Flag, Image, Newspaper, NotepadText, Tags, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import PATH from '@/constants/path'

const navMain: {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}[] = [
  {
    title: 'Đơn hàng',
    url: PATH.ADMIN_ORDERS,
    icon: NotepadText,
    isActive: true,
    items: [
      {
        title: 'Danh sách',
        url: PATH.ADMIN_ORDERS
      }
    ]
  },
  {
    title: 'Sản phẩm',
    url: '#',
    icon: Tags,
    isActive: false,
    items: [
      {
        title: 'Danh sách',
        url: PATH.ADMIN_PRODUCTS
      },
      {
        title: 'Tạo mới',
        url: PATH.ADMIN_PRODUCTS_NEW
      }
    ]
  },
  {
    title: 'Danh mục sản phẩm',
    url: PATH.ADMIN_PRODUCT_CATEGORIES,
    icon: Flag,
    isActive: false,
    items: [
      {
        title: 'Danh sách',
        url: PATH.ADMIN_PRODUCT_CATEGORIES
      }
    ]
  },
  {
    title: 'Media',
    url: '#',
    icon: Image,
    isActive: false,
    items: [
      {
        title: 'Hình ảnh',
        url: PATH.ADMIN_IMAGES
      }
    ]
  },
  {
    title: 'Bài viết',
    url: PATH.ADMIN_BLOGS,
    icon: Newspaper,
    items: [
      {
        title: 'Danh sách',
        url: PATH.ADMIN_BLOGS
      },
      {
        title: 'Tạo mới',
        url: PATH.ADMIN_BLOGS_NEW
      }
    ]
  }
] as const

export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Nền tảng</SidebarGroupLabel>
      <SidebarMenu>
        {navMain.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
