'use client'

import { useQuery } from '@tanstack/react-query'
import { Grid2X2, Loader2, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import productsApis from '@/apis/products.apis'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PATH from '@/constants/path'

export default function CategoriesDialog({ smallTrigger }: { smallTrigger?: boolean }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const getProductCategoriesQuery = useQuery({
    queryKey: ['get-product-categories'],
    queryFn: () => productsApis.getProductCategories(),
    enabled: isOpen
  })

  const categories = React.useMemo(
    () => getProductCategoriesQuery.data?.payload.data.productCategories ?? [],
    [getProductCategoriesQuery.data?.payload.data.productCategories]
  )

  const totalCategories = getProductCategoriesQuery.data?.payload.data.pagination.totalRows ?? 0

  return (
    <React.Fragment>
      <Button variant='outline' size={smallTrigger ? 'icon' : 'default'} onClick={() => setIsOpen(true)}>
        <Menu />
        {!smallTrigger && 'Danh mục sản phẩm'}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Danh mục sản phẩm</DialogTitle>
            <DialogDescription>Tất cả danh mục sản phẩm trên hệ thống</DialogDescription>
          </DialogHeader>
          {totalCategories > 0 && !getProductCategoriesQuery.isLoading && (
            <div className='grid grid-cols-12 md:grid-cols-10 gap-1 mt-4'>
              <Link
                href={PATH.PRODUCTS}
                className='col-span-4 md:col-span-2 flex flex-col items-center space-y-4 p-2 rounded-md duration-100 hover:bg-muted'
              >
                <Grid2X2 className='size-[50px] stroke-1' />
                <p className='text-center text-sm'>Tất cả sản phẩm</p>
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`${PATH.PRODUCTS}?categoryIds=${category._id}`}
                  className='col-span-4 md:col-span-2 flex flex-col items-center space-y-4 p-2 rounded-md duration-100 hover:bg-muted'
                >
                  <Image
                    width={50}
                    height={50}
                    src={category.thumbnail}
                    alt={category.name}
                    className='size-[50px] rounded-md object-cover'
                  />
                  <p className='text-center text-sm'>{category.name}</p>
                </Link>
              ))}
            </div>
          )}
          {getProductCategoriesQuery.isLoading && (
            <div className='flex justify-center py-10'>
              <Loader2 className='animate-spin stroke-1 size-10' />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
