import { Truck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import PATH from '@/constants/path'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Link href={PATH.HOME} className='flex items-center gap-2 self-center font-medium'>
          <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
            <Truck className='size-4' />
          </div>
          MuaHangNhanh
        </Link>
        {children}
      </div>
    </div>
  )
}
