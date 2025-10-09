import ProductItem from '@/app/(shop)/_components/product-item'
import { ProductType } from '@/types/products.types'

export default function ProductsList({
  products,
  itemClassName = 'col-span-6 md:col-span-3 lg:col-span-2'
}: {
  products: ProductType[]
  itemClassName?: string
}) {
  return (
    <div className='grid grid-cols-12 gap-4'>
      {products.map((product) => (
        <div key={product._id} className={itemClassName}>
          <ProductItem product={product} />
        </div>
      ))}
    </div>
  )
}
