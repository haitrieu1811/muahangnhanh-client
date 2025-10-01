'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import PATH from '@/constants/path'
import { ProductCategoryType } from '@/types/products.types'

export default function CategoriesDialog({
  categories,
  children
}: {
  categories: ProductCategoryType[]
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Danh mục sản phẩm</DialogTitle>
        </DialogHeader>
        {categories.length > 0 && (
          <div className='grid grid-cols-12 md:grid-cols-10 gap-1 mt-4'>
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
      </DialogContent>
    </Dialog>
  )
}
