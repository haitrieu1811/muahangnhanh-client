'use client'

import { Loader2, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDebounce } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import useProducts from '@/hooks/use-products'
import { formatCurrency } from '@/lib/utils'

const MAX_RESULTS = 5

export default function HeaderSearch() {
  const [searchKeyword, setSearchKeyword] = React.useState<string>('')
  const [debounceSearchKeyword] = useDebounce(searchKeyword, 1000)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const { products, isFetching, totalProducts } = useProducts({
    enabled: debounceSearchKeyword.trim().length > 0,
    query: {
      name: debounceSearchKeyword
    }
  })

  const handleClear = () => {
    setSearchKeyword('')
    inputRef.current?.focus()
  }

  return (
    <div className='relative'>
      <div className='absolute left-0 inset-y-0 w-10 flex justify-center items-center'>
        <Search className='stroke-1 size-4' />
      </div>
      <Input
        ref={inputRef}
        placeholder='Tìm kiếm...'
        value={searchKeyword}
        className='pl-10'
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      {isFetching && (
        <div className='absolute right-0 inset-y-0 w-10 flex justify-center items-center'>
          <Loader2 className='stroke-1 size-4 animate-spin' />
        </div>
      )}
      {!isFetching && searchKeyword.length > 0 && (
        <button className='absolute right-0 inset-y-0 w-10 flex justify-center items-center' onClick={handleClear}>
          <X className='stroke-1 size-4' />
        </button>
      )}
      {/* Kết quả tìm kiếm */}
      {debounceSearchKeyword.trim() && !isFetching && (
        <div className='absolute top-[calc(100%+6px)] inset-x-0 rounded-md border bg-card'>
          {/* Danh sách kết quả */}
          {totalProducts > 0 && (
            <div className='p-2'>
              {products.slice(0, MAX_RESULTS).map((product) => (
                <Link
                  key={product._id}
                  href={'/'}
                  className='p-2 duration-100 hover:bg-muted flex space-x-4 rounded-md'
                >
                  <Image
                    width={50}
                    height={50}
                    src={product.thumbnail.url}
                    alt={product.name}
                    className='size-[50px] rounded-md object-cover shrink-0'
                  />
                  <div className='flex-1'>
                    <div className='text-sm line-clamp-1'>{product.name}</div>
                    <div className='flex items-center space-x-4 text-sm'>
                      <div className='text-highlight font-semibold'>
                        {formatCurrency(product.priceAfterDiscount)}&#8363;
                      </div>
                      <div className='line-through text-muted-foreground'>{formatCurrency(product.price)}&#8363;</div>
                    </div>
                  </div>
                </Link>
              ))}
              {totalProducts > MAX_RESULTS && (
                <div className='flex justify-center mt-2'>
                  <Button asChild variant='link' className='p-0 text-highlight'>
                    <Link href={`${PATH.PRODUCTS}?name=${searchKeyword}`}>Xem thêm các kết quả tìm kiếm</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
          {/* Không tìm thấy sản phẩm */}
          {totalProducts === 0 && <p className='text-center font-medium text-sm p-4'>Không tìm thấy sản phẩm nào.</p>}
        </div>
      )}
    </div>
  )
}
