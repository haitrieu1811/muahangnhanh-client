import Image from 'next/image'
import Link from 'next/link'

import blogsApis from '@/apis/blogs.apis'
import productsApis from '@/apis/products.apis'
import ProductItem from '@/app/(shop)/_components/product-item'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { BlogType } from '@/types/blogs.types'
import { ProductCategoryType, ProductType } from '@/types/products.types'
import PATH from '@/constants/path'

export default async function HomePage() {
  let productCategories: ProductCategoryType[] = []
  let products: ProductType[] = []
  let blogs: BlogType[] = []

  try {
    const [getProductCategoriesRes, getProductsRes, getBlogsRes] = await Promise.all([
      productsApis.getProductCategories(),
      productsApis.getProducts({
        isFlashSale: true,
        isActive: true
      }),
      blogsApis.getBlogs()
    ])
    productCategories = getProductCategoriesRes.payload.data.productCategories
    products = getProductsRes.payload.data.products
    blogs = getBlogsRes.payload.data.blogs
  } catch {}

  return (
    <div className='container py-2 space-y-4'>
      {/* Carousel */}
      <Carousel>
        <CarouselContent>
          <CarouselItem className='rounded-md'>
            <div className='bg-blue-400 rounded-md flex items-center justify-between space-x-10'>
              <div className='flex-1 pl-20 space-y-4 text-white'>
                <h3 className='text-2xl tracking-tight'>Học HTML CSS cho người mới</h3>
                <p>
                  Thực hành dự án với Figma, hàng trăm bài tập, hướng dẫn 100% bởi Sơn Đặng, tặng kèm Flashcards, v.v.
                </p>
                <Button variant='secondary' className='rounded-full'>
                  Học thử miễn phí{' '}
                </Button>
              </div>
              <Image
                width={500}
                height={500}
                src={'http://localhost:4000/static/images/20b7ff15e5e4097c5f50c0c01.png'}
                alt=''
                className='h-[240px] object-contain shrink-0'
              />
            </div>
          </CarouselItem>
          <CarouselItem className='rounded-md'>
            <div className='bg-main rounded-md flex items-center justify-between space-x-10'>
              <div className='flex-1 pl-20 space-y-4 text-white'>
                <h3 className='text-2xl tracking-tight'>Mở bán khóa Javascript Pro</h3>
                <p>Từ 08/08/2024 khóa học sẽ có giá 1.399k. Khi khóa học hoàn thiện sẽ trở về giá gốc.</p>
                <Button variant='secondary' className='rounded-full'>
                  Học thử miễn phí{' '}
                </Button>
              </div>
              <Image
                width={500}
                height={500}
                src={'http://localhost:4000/static/images/20b7ff15e5e4097c5f50c0c02.png'}
                alt=''
                className='h-[240px] object-contain shrink-0'
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious variant='secondary' className='-left-4' />
        <CarouselNext variant='secondary' className='-right-4' />
      </Carousel>
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
                className='col-span-1 flex flex-col items-center space-y-4 p-2 rounded-md duration-100 hover:bg-muted'
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
          <div className='grid grid-cols-12 gap-4'>
            {products.map((product) => (
              <div key={product._id} className='col-span-2'>
                <ProductItem product={product} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Bài viết */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Bài viết mới nhất</CardTitle>
          <CardAction>
            <Button asChild variant='link' className='p-0'>
              <Link href={'#'}>Xem thêm</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'>
            {blogs.slice(0, 4).map((blog) => (
              <div key={blog._id} className='col-span-3'>
                <Link href={'#'} className='group relative block rounded-md overflow-hidden space-y-2'>
                  <div className='rounded-md overflow-hidden'>
                    <Image
                      width={200}
                      height={200}
                      src={blog.thumbnail.url}
                      alt=''
                      className='w-full aspect-video object-cover group-hover:scale-105 duration-100'
                    />
                  </div>
                  <h3 className='text-sm line-clamp-2 font-medium'>{blog.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
