import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import blogsApis from '@/apis/blogs.apis'
import productsApis from '@/apis/products.apis'
import HomeCarousel from '@/app/(shop)/_components/home-carousel'
import ProductsList from '@/app/(shop)/_components/products-list'
import BlogItem from '@/components/blog-item'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import { BlogType } from '@/types/blogs.types'
import { ProductCategoryType, ProductType } from '@/types/products.types'

export const metadata: Metadata = {
  title: 'Trang chủ'
}

export default async function HomePage() {
  let productCategories: ProductCategoryType[] = []
  let products: ProductType[] = []
  let blogs: BlogType[] = []

  try {
    const [getProductCategoriesRes, getProductsRes, getBlogsRes] = await Promise.all([
      productsApis.getProductCategories({
        limit: 12
      }),
      productsApis.getProducts({
        isFlashSale: true,
        isActive: true
      }),
      blogsApis.getBlogs({
        limit: 4
      })
    ])
    productCategories = getProductCategoriesRes.payload.data.productCategories
    products = getProductsRes.payload.data.products
    blogs = getBlogsRes.payload.data.blogs
  } catch {}

  return (
    <div className='container py-4 space-y-4'>
      {/* Carousel */}
      <HomeCarousel />
      {/* Danh mục nổi bật */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Danh mục nổi bật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-12'>
            {productCategories.map((productCategory) => (
              <Link
                key={productCategory._id}
                href={`${PATH.PRODUCTS}?categoryIds=${productCategory._id}`}
                className='col-span-4 md:col-span-2 lg:col-span-1 flex flex-col items-center space-y-4 p-2 rounded-md duration-100 hover:bg-muted'
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
        </CardContent>
      </Card>
      {/* Flash sale */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Flash sale</CardTitle>
          <CardAction>
            <Button asChild variant='link' className='text-highlight p-0'>
              <Link href={PATH.PRODUCTS}>Xem thêm</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ProductsList products={products} />
        </CardContent>
      </Card>
      {/* Bài viết */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Bài viết mới nhất</CardTitle>
          <CardAction>
            <Button asChild variant='link' className='p-0 text-highlight'>
              <Link href={PATH.BLOGS}>Xem thêm</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'>
            {blogs.map((blog) => (
              <div key={blog._id} className='col-span-6 lg:col-span-3'>
                <BlogItem blog={blog} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
