import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export default function ShopFooter() {
  return (
    <footer>
      <div className='space-y-1 p-4'>
        <div className='flex justify-center'>
          <Link href={PATH.HOME} className='font-semibold text-xl tracking-tight'>
            LOGO
          </Link>
        </div>
        <div className='text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm'>
          Giao diện người dùng được xây dựng bằng{' '}
          <Button asChild variant='link' className='p-0'>
            <Link href='https://nextjs.org' target='_blank'>
              NextJS
            </Link>
          </Button>{' '}
          và{' '}
          <Button asChild variant='link' className='p-0'>
            <Link href='https://ui.shadcn.com' target='_blank'>
              ShadcnUI
            </Link>
          </Button>
          , mã nguồn có sẵn trên{' '}
          <Button asChild variant='link' className='p-0'>
            <Link href='https://github.com/haitrieu1811/muahangnhanh-client' target='_blank'>
              Github
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
