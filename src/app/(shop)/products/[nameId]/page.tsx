import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import blogsApis from '@/apis/blogs.apis'
import productsApis from '@/apis/products.apis'
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
    <div className='container mt-4 space-y-4'>
      <Card>
        <CardContent>
          <div className='grid grid-cols-12 gap-10'>
            <div className='col-span-5'>
              <ProductDetailPhotos product={product} />
            </div>
            <div className='col-span-7 space-y-6'>
              <h1>{product.name}</h1>
              <div className='flex items-center space-x-4'>
                {product.priceAfterDiscount < product.price ? (
                  <React.Fragment>
                    <div className='font-semibold text-3xl text-main dark:text-main-foreground'>
                      {formatCurrency(product.priceAfterDiscount)}&#8363;
                    </div>
                    <div className='text-muted-foreground line-through'>{formatCurrency(product.price)}&#8363;</div>
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
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  className='flex-auto border-main dark:border-main-foreground text-main dark:text-main-foreground hover:text-main'
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button className='flex-auto bg-main dark:bg-main-foreground hover:bg-main/80 dark:hover:bg-main-foreground/80'>
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex items-start space-x-4'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='text-xl'>Mô tả sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <Prose html={product.description} />
          </CardContent>
        </Card>
        <Card className='basis-1/3'>
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
