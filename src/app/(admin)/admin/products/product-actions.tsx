'use client'

import { EllipsisVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import PATH from '@/constants/path'

export default function ProductActions({ productId }: { productId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='outline'>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={PATH.ADMIN_PRODUCTS_DETAIL(productId)}>Chi tiết</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='text-destructive hover:text-destructive!'>Xóa</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
