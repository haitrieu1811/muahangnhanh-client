import { PlusCircle } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import productsApis from '@/apis/products.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import ProductActions from '@/app/(admin)/admin/products/product-actions'
import AdminProductsSearch from '@/app/(admin)/admin/products/search'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import { HttpError } from '@/lib/http'
import { dateDistance, formatCurrency } from '@/lib/utils'
import { ProductType } from '@/types/products.types'

const MAX_CHARACTERS = 50

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams?: Promise<{
    page?: string
    limit?: string
    name?: string
  }>
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  const _seachParams = await searchParams
  const searchName = _seachParams?.name || ''

  let products: ProductType[] = []
  let totalProducts = 0

  try {
    const res = await productsApis.getAllProducts({
      accessToken,
      query: {
        name: searchName,
        page: 1
      }
    })
    products = res.payload.data.products
    totalProducts = res.payload.data.pagination.totalRows
  } catch (error) {
    if (error instanceof HttpError) {
      console.error(error.payload)
    }
  }

  return (
    <div className='space-y-10'>
      <div className='flex justify-between items-center space-x-10'>
        <PageTitle title='Sản phẩm' subTitle={totalProducts.toString()} />
        <Button asChild variant='outline'>
          <Link href={PATH.ADMIN_PRODUCTS_NEW}>
            <PlusCircle />
            Thêm sản phẩm mới
          </Link>
        </Button>
      </div>
      <div className='space-y-4'>
        {/* Tìm kiếm - Lọc sản phẩm */}
        <AdminProductsSearch />
        {/* Danh sách sản phẩm */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Giá tiền</TableHead>
                  <TableHead>Tạo lúc</TableHead>
                  <TableHead>Cập nhật lúc</TableHead>
                  <TableHead className='text-right'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Image
                        width={200}
                        height={200}
                        src={product.thumbnail.url}
                        alt={product.name}
                        className='size-[50px] aspect-square rounded-md object-cover'
                      />
                    </TableCell>
                    <TableCell>
                      <span>
                        {product.name.length > MAX_CHARACTERS
                          ? `${product.name.substring(0, MAX_CHARACTERS)}...`
                          : product.name}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}&#8363;</TableCell>
                    <TableCell>{dateDistance(product.createdAt)}</TableCell>
                    <TableCell>{dateDistance(product.updatedAt)}</TableCell>
                    <TableCell className='flex justify-end'>
                      <ProductActions />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
