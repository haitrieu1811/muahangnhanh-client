import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import blogsApis from '@/apis/blogs.apis'
import productsApis from '@/apis/products.apis'
import ProductDetailActions from '@/app/(shop)/products/[nameId]/actions'
import ProductDetailPhotos from '@/app/(shop)/products/[nameId]/photos'
import Prose from '@/components/prose'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getIdFromNameId, rateSale } from '@/lib/utils'
import { BlogType } from '@/types/blogs.types'
import { ProductType } from '@/types/products.types'

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{
    nameId: string
  }>
}) {
  const { nameId } = await params
  const id = getIdFromNameId(nameId)

  let product: ProductType | null = null
  let blogs: BlogType[] = []

  try {
    const [getProductRes, getBlogsRes] = await Promise.all([
      productsApis.getProduct(id),
      blogsApis.getBlogs({ limit: 5 })
    ])

    product = getProductRes.payload.data.product
    blogs = getBlogsRes.payload.data.blogs
  } catch {}

  if (!product) return null

  return (
    <div className='container py-4 space-y-4'>
      <Card>
        <CardContent>
          <div className='grid grid-cols-12 gap-2 md:gap-4 lg:gap-10'>
            <div className='col-span-12 md:col-span-6 lg:col-span-5'>
              <ProductDetailPhotos product={product} />
            </div>
            <div className='col-span-12 md:col-span-6 lg:col-span-7 space-y-6'>
              <h1>{product.name}</h1>
              <div className='grid gap-2 md:gap-0 md:flex md:items-center md:space-x-4'>
                {product.priceAfterDiscount < product.price ? (
                  <React.Fragment>
                    <span className='font-semibold text-3xl text-main dark:text-main-foreground'>
                      {formatCurrency(product.priceAfterDiscount)}&#8363;
                    </span>
                    <span className='text-muted-foreground line-through'>{formatCurrency(product.price)}&#8363;</span>
                    <Badge className='bg-main dark:bg-main-foreground'>
                      {rateSale(product.price, product.priceAfterDiscount)}%
                    </Badge>
                  </React.Fragment>
                ) : (
                  <div className='font-semibold text-3xl text-main dark:text-main-foreground'>
                    {formatCurrency(product.price)}&#8363;
                  </div>
                )}
              </div>
              {product.isActive && <ProductDetailActions productId={product._id} />}
              {!product.isActive && (
                <div className='border-2 rounded-md border-destructive text-destructive p-2 flex justify-center'>
                  Sản phẩm đã tạm ngừng hoạt động
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex flex-wrap items-start space-x-0 lg:space-x-4 space-y-4 lg:space-y-0'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='text-xl'>Mô tả sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <Prose html={product.description} />
          </CardContent>
        </Card>
        <Card className='basis-full lg:basis-1/3'>
          <CardHeader>
            <CardTitle className='text-xl'>Bài viết</CardTitle>
            <CardAction>
              <Button asChild variant='link' className='p-0'>
                <Link href='#'>Xem thêm</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className='space-y-4'>
            {blogs.map((blog) => (
              <Link key={blog._id} href={'#'} className='flex items-center space-x-2'>
                <Image
                  width={100}
                  height={100}
                  src={blog.thumbnail.url}
                  alt={blog.title}
                  className='object-cover w-[100px] aspect-video rounded-md'
                />
                <h3 className='text-sm line-clamp-2'>{blog.title}</h3>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
