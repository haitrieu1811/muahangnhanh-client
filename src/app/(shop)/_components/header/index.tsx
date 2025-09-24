import { Menu } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

import usersApis from '@/apis/users.apis'
import HeaderUser from '@/app/(shop)/_components/header/user'
import ModeToggle from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import { User } from '@/types/users.types'

export default async function ShopHeader() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let user: User | null = null

  try {
    const res = await usersApis.getMe(accessToken)
    user = res.payload.data.user
  } catch {}

  return (
    <header className='bg-background border-b'>
      <div className='container flex items-center justify-between space-x-10 h-14'>
        {/* Logo */}
        <Link href={PATH.HOME} className='font-semibold text-2xl tracking-tight'>
          Logo
        </Link>

        <div className='flex items-center space-x-4'>
          {/* Danh mục */}
          <Button variant='secondary'>
            <Menu />
            Danh mục
          </Button>

          {/* Tìm kiếm */}
          <Input placeholder='Tìm kiếm...' className='w-[400px]' />
        </div>

        <div className='flex items-center space-x-4'>
          <HeaderUser user={user} />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
