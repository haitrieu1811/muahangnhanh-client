import { Bell, Handbag, Search } from 'lucide-react'
import { cookies } from 'next/headers'
import React from 'react'

import productsApis from '@/apis/products.apis'
import usersApis from '@/apis/users.apis'
import HeaderAccount from '@/app/(shop)/_components/header/account'
import HeaderCartPopover from '@/app/(shop)/_components/header/cart-popover'
import CategoriesDialog from '@/app/(shop)/_components/header/categories-dialog'
import MobileNav from '@/app/(shop)/_components/header/mobile-nav'
import HeaderNotificationsPopover from '@/app/(shop)/_components/header/notifications-popover'
import HeaderSearch from '@/app/(shop)/_components/header/search'
import Logo from '@/components/logo'
import ModeToggle from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ProductCategoryType } from '@/types/products.types'
import { User } from '@/types/users.types'

export default async function ShopHeader() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let user: User | null = null
  let productCategories: ProductCategoryType[] = []

  try {
    const getMeRes = await usersApis.getMe(accessToken)
    user = getMeRes.payload.data.user
  } catch {}

  try {
    const getProductCategoriesRes = await productsApis.getProductCategories()
    productCategories = getProductCategoriesRes.payload.data.productCategories
  } catch {}

  return (
    <React.Fragment>
      {/* PC */}
      <header className='hidden lg:block bg-card border-b sticky top-0 inset-x-0 z-10'>
        <div className='container flex items-center justify-between space-x-8 h-14 px-4 lg:px-0'>
          <div className='flex items-center space-x-8'>
            {/* Logo */}
            <Logo />
            {/* Danh mục */}
            <CategoriesDialog categories={productCategories} />
          </div>
          {/* Tìm kiếm */}
          <div className='flex-1'>
            <HeaderSearch />
          </div>
          {/* Giỏ hàng - thông báo - tài khoản */}
          <div className='flex items-center space-x-4'>
            <HeaderAccount user={user} accessToken={accessToken} />
            <ModeToggle />
          </div>
        </div>
      </header>
      {/* Mobile */}
      <header className='block lg:hidden border-b bg-card sticky top-0 inset-x-0 z-10'>
        <div className='flex justify-between items-center space-x-4 px-4 h-14'>
          {/* Logo */}
          <Logo />
          <div className='flex space-x-2'>
            {/* Tìm kiếm */}
            <Popover>
              <PopoverTrigger asChild>
                <Button size='icon' variant='outline'>
                  <Search />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-screen'>
                <HeaderSearch />
              </PopoverContent>
            </Popover>
            {/* Danh mục sản phẩm */}
            <CategoriesDialog smallTrigger categories={productCategories} />
            {/* Thông báo */}
            <HeaderNotificationsPopover>
              <Button size='icon' variant='outline'>
                <Bell />
              </Button>
            </HeaderNotificationsPopover>
            {/* Giỏ hàng */}
            <HeaderCartPopover>
              <Button size='icon' variant='outline'>
                <Handbag />
              </Button>
            </HeaderCartPopover>
            {/* Mode toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>
      {/* Mobile nav */}
      <MobileNav />
    </React.Fragment>
  )
}
