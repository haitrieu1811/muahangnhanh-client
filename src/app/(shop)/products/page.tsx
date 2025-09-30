import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { FileSearch } from 'lucide-react'

import productsApis from '@/apis/products.apis'
import ProductItem from '@/app/(shop)/_components/product-item'
import ProductsFilter from '@/app/(shop)/products/filter'
import ProductsOrder from '@/app/(shop)/products/sort'
import CustomPagination from '@/components/custom-pagination'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetProductsReqQuery, ProductCategoryType, ProductType } from '@/types/products.types'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<GetProductsReqQuery> }) {
  const { categoryIds: categoryIdsStr, sortBy, orderBy, page, limit, minPrice, maxPrice } = await searchParams

  let products: ProductType[] = []
  let totalProducts: number = 0
  let totalProductsPages: number = 0

  let productCategories: ProductCategoryType[] = []

  try {
    const [getProductsRes, getProductCategoriesRes] = await Promise.all([
      productsApis.getProducts(
        omitBy(
          {
            isActive: true,
            categoryIds: categoryIdsStr,
            sortBy,
            orderBy,
            page,
            limit,
            minPrice,
            maxPrice
          },
          isUndefined
        )
      ),
      productsApis.getProductCategories()
    ])
    products = getProductsRes.payload.data.products
    totalProducts = getProductsRes.payload.data.pagination.totalRows
    totalProductsPages = getProductsRes.payload.data.pagination.totalPages

    productCategories = getProductCategoriesRes.payload.data.productCategories
  } catch {}

  return (
    <div className='container py-4'>
      <div className='flex items-start space-x-4'>
        <Card className='basis-1/4'>
          <CardHeader>
            <CardTitle className='text-xl'>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsFilter productCategories={productCategories} />
          </CardContent>
        </Card>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='text-2xl'>Sản phẩm</CardTitle>
            <CardAction>
              <ProductsOrder />
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Danh sách sản phẩm */}
            {totalProducts > 0 && (
              <div className='space-y-8'>
                <div className='grid grid-cols-12 gap-4'>
                  {products.map((product) => (
                    <div key={product._id} className='col-span-3'>
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
                <CustomPagination totalPages={totalProductsPages} />
              </div>
            )}

            {/* Không có sản phẩm nào */}
            {totalProducts === 0 && (
              <div className='flex flex-col items-center space-y-4 text-muted-foreground p-20'>
                <FileSearch className='stroke-1 size-20' />
                <p>Không có sản phẩm nào. Bạn thử tắt điều kiện lọc và tìm lại nhé?</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
