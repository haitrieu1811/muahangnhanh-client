import { Menu } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import productsApis from '@/apis/products.apis'
import usersApis from '@/apis/users.apis'
import HeaderAccount from '@/app/(shop)/_components/header/account'
import HeaderSearch from '@/app/(shop)/_components/header/search'
import ModeToggle from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import PATH from '@/constants/path'
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
    <header className='bg-card border-b sticky top-0 inset-x-0 z-10'>
      <div className='container flex items-center justify-between space-x-10 h-14'>
        <div className='flex items-center space-x-8'>
          {/* Logo */}
          <Link href={PATH.HOME} className='font-black text-3xl border-b-4 border-main dark:border-main-foreground'>
            MHNH
          </Link>
          {/* Danh mục */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='secondary'>
                <Menu />
                Danh mục
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Danh mục sản phẩm</DialogTitle>
              </DialogHeader>
              {productCategories.length > 0 && (
                <div className='grid grid-cols-10 gap-1 mt-4'>
                  {productCategories.map((productCategory) => (
                    <Link
                      key={productCategory._id}
                      href={`${PATH.PRODUCTS}?categoryIds=${productCategory._id}`}
                      className='col-span-2 flex flex-col items-center space-y-4 p-2 rounded-md duration-100 hover:bg-muted'
                    >
                      <Image
                        width={50}
                        height={50}
                        src={productCategory.thumbnail}
                        alt={productCategory.name}
                        className='size-[50px] rounded-md object-cover'
                      />
                      <p className='text-center text-sm'>{productCategory.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Tìm kiếm */}
        <div className='flex-1'>
          <HeaderSearch />
        </div>

        <div className='flex items-center space-x-4'>
          <HeaderAccount user={user} />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
