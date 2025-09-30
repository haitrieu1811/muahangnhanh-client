import Image from 'next/image'

import productsApis from '@/apis/products.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import CreateNewButton from '@/app/(admin)/admin/product-categories/create-new-button'
import ProductCategoryActions from '@/app/(admin)/admin/product-categories/product-category-actions'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { dateDistance } from '@/lib/utils'
import { ProductCategoryType } from '@/types/products.types'

export default async function ProductCategoriesPage() {
  let productCategories: ProductCategoryType[] = []
  let totalProductCategories = 0

  try {
    const res = await productsApis.getProductCategories()
    productCategories = res.payload.data.productCategories
    totalProductCategories = res.payload.data.pagination.totalRows
  } catch {}

  return (
    <div className='space-y-10'>
      <div className='flex justify-between items-center space-x-10'>
        <PageTitle title='Danh mục sản phẩm' subTitle={totalProductCategories.toString()} />
        <CreateNewButton />
      </div>
      <Card>
        <CardContent>
          {productCategories.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead>Tạo lúc</TableHead>
                  <TableHead>Cập nhật lúc</TableHead>
                  <TableHead className='text-right'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productCategories.map((productCategory) => (
                  <TableRow key={productCategory._id}>
                    <TableCell>
                      <Image
                        width={200}
                        height={200}
                        src={productCategory.thumbnail}
                        alt={productCategory.name}
                        className='size-[50px] aspect-square rounded-md object-cover'
                      />
                    </TableCell>
                    <TableCell>{productCategory.name}</TableCell>
                    <TableCell>{productCategory.totalProducts} sản phẩm</TableCell>
                    <TableCell>{dateDistance(productCategory.createdAt)}</TableCell>
                    <TableCell>{dateDistance(productCategory.updatedAt)}</TableCell>
                    <TableCell>
                      <div className='flex justify-end items-center'>
                        <ProductCategoryActions productCategory={productCategory} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {productCategories.length === 0 && (
            <p className='text-sm font-medium'>Không tìm thấy danh mục sản phẩm nào.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
