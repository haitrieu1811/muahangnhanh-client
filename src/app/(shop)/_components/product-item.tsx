import { Flame } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { formatCurrency, rateSale } from '@/lib/utils'
import { ProductType } from '@/types/products.types'
import PATH from '@/constants/path'

export default function ProductItem({ product }: { product: ProductType }) {
  return (
    <Link
      href={PATH.PRODUCTS_DETAIL({
        name: product.name,
        id: product._id
      })}
      className='group relative block rounded-md overflow-hidden'
    >
      {product.priceAfterDiscount < product.price && (
        <div className='absolute top-0 right-0 z-1 rounded-bl-md bg-main dark:bg-main-foreground p-1 text-primary-foreground text-xs font-semibold'>
          Giảm {rateSale(product.price, product.priceAfterDiscount)}%
        </div>
      )}
      <div className='relative rounded-md overflow-hidden'>
        <Image
          width={200}
          height={200}
          src={product.thumbnail.url}
          alt=''
          className='w-full aspect-square object-cover group-hover:scale-105 duration-100'
        />
        <div className='absolute bottom-0 inset-x-0 p-1'>
          {product.isFlashSale && (
            <Badge variant='destructive' className='bg-red-600!'>
              <Flame className='stroke-yellow-400' />
              Flash sale
            </Badge>
          )}
        </div>
      </div>
      <div className='mt-2 space-y-2'>
        <h3 className='text-sm line-clamp-2 font-medium'>{product.name}</h3>
        {product.priceAfterDiscount < product.price ? (
          <div className='text-sm space-y-1'>
            <div className='text-muted-foreground line-through'>{formatCurrency(product.price)}&#8363;</div>
            <div className='text-main dark:text-main-foreground font-semibold'>
              {formatCurrency(product.priceAfterDiscount)}&#8363;
            </div>
          </div>
        ) : (
          <div className='text-main dark:text-main-foreground font-semibold text-sm'>
            {formatCurrency(product.price)}&#8363;
          </div>
        )}
      </div>
    </Link>
  )
}
