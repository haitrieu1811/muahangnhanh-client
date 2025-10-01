'use client'

import { CheckedState } from '@radix-ui/react-checkbox'
import { Minus, RotateCcw } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NUMBER_GREATER_THAN_ONE_REGEX } from '@/constants/regex'
import { ProductCategoryType } from '@/types/products.types'

export default function ProductsFilter({ productCategories }: { productCategories: ProductCategoryType[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = new URLSearchParams(searchParams)

  const categoryIds = searchParams.get('categoryIds')
  const categoryIdsArr = categoryIds?.split('-') ?? []
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const handleFilterByCategoryId = ({
    checkedState,
    categoryId
  }: {
    categoryId: string
    checkedState: CheckedState
  }) => {
    // Thêm vào
    if (checkedState) {
      params.set('categoryIds', [...categoryIdsArr, categoryId].join('-'))
    }
    // Xóa đi
    else {
      const newCategoryIds = categoryIdsArr.filter((item) => item !== categoryId)
      if (newCategoryIds.length > 0) {
        params.set('categoryIds', newCategoryIds.join('-'))
      } else {
        params.delete('categoryIds')
      }
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleMinPrice = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value && NUMBER_GREATER_THAN_ONE_REGEX.test(value)) {
      params.set('minPrice', value)
    } else {
      params.delete('minPrice')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 1000)

  const handleMaxPrice = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value && NUMBER_GREATER_THAN_ONE_REGEX.test(value)) {
      params.set('maxPrice', value)
    } else {
      params.delete('maxPrice')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 1000)

  const handleReset = (fields: string[]) => {
    fields.forEach((field) => {
      params.delete(field)
    })
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='grid gap-10'>
      {/* Danh mục */}
      <div className='grid gap-4'>
        <div className='flex justify-between items-center space-x-4'>
          <Label>Danh mục sản phẩm</Label>
          {categoryIds && (
            <Button variant='outline' size='sm' onClick={() => handleReset(['categoryIds'])}>
              <RotateCcw />
              Đặt lại
            </Button>
          )}
        </div>
        <div className='grid gap-4'>
          {productCategories.map((productCategory) => (
            <div key={productCategory._id} className='flex items-center gap-3'>
              <Checkbox
                id={productCategory._id}
                defaultChecked={categoryIdsArr.includes(productCategory._id)}
                checked={categoryIdsArr.includes(productCategory._id)}
                onCheckedChange={(checkedState) =>
                  handleFilterByCategoryId({ checkedState, categoryId: productCategory._id })
                }
              />
              <Label htmlFor={productCategory._id}>{productCategory.name}</Label>
            </div>
          ))}
        </div>
      </div>
      {/* Khoảng giá */}
      <div className='grid gap-4'>
        <Label>Khoảng giá &#8363;</Label>
        <div className='flex items-center space-x-2'>
          <Input placeholder='Từ' defaultValue={minPrice?.toString()} onChange={handleMinPrice} />
          <Minus />
          <Input placeholder='Đến' defaultValue={maxPrice?.toString()} onChange={handleMaxPrice} />
        </div>
      </div>
    </div>
  )
}
