import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import blogsApis from '@/apis/blogs.apis'
import productsApis from '@/apis/products.apis'
import ProductDetailActions from '@/app/(shop)/products/[nameId]/actions'
import ProductDetailDescription from '@/app/(shop)/products/[nameId]/description'
import ProductDetailPhotos from '@/app/(shop)/products/[nameId]/photos'
import { baseOpenGraph } from '@/app/shared-metadata'
import Breadcrumb from '@/components/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ENV_CONFIG } from '@/constants/config'
import PATH from '@/constants/path'
import { formatCurrency, getIdFromNameId, normalizePath, rateSale } from '@/lib/utils'
import { BlogType } from '@/types/blogs.types'
import { ProductType } from '@/types/products.types'
import ProductsList from '@/app/(shop)/_components/products-list'

export async function generateMetadata({
  params
}: {
  params: Promise<{
    nameId: string
  }>
}): Promise<Metadata> {
  const { nameId } = await params
  const productId = getIdFromNameId(nameId)
  const res = await productsApis.getProduct(productId)
  const product = res.payload.data.product
  const path = PATH.PRODUCTS_DETAIL({
    name: product.name,
    id: product._id
  })
  const url = `${ENV_CONFIG.NEXT_PUBLIC_BASE_URL}/${normalizePath(path)}`
  return {
    title: product.metadata?.title,
    description: product.metadata?.description,
    openGraph: {
      ...baseOpenGraph,
      title: product.metadata?.title,
      description: product.metadata?.description,
      url,
      images: [
        {
          url: product.thumbnail.url
        }
      ]
    },
    alternates: {
      canonical: path
    }
  }
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{
    nameId: string
  }>
}) {
  const { nameId } = await params
  const productId = getIdFromNameId(nameId)

  let product: ProductType | null = null
  let blogs: BlogType[] = []
  let relatedProducts: ProductType[] = []

  try {
    const [getProductRes, getBlogsRes] = await Promise.all([
      productsApis.getProduct(productId),
      blogsApis.getBlogs({ limit: 5 })
    ])

    product = getProductRes.payload.data.product
    blogs = getBlogsRes.payload.data.blogs
  } catch {}

  if (!product) return null

  try {
    const getRelatedProductsRes = await productsApis.getProducts({
      categoryIds: product.category._id,
      limit: 13
    })
    relatedProducts = getRelatedProductsRes.payload.data.products.filter((item) => item._id !== product._id)
  } catch {}

  return (
    <div className='container pb-4'>
      <Breadcrumb
        data={[
          {
            name: 'Sản phẩm',
            path: PATH.PRODUCTS
          },
          {
            name: product.category.name,
            path: `${PATH.PRODUCTS}?categoryIds=${product.category._id}`
          },
          {
            name: product.name
          }
        ]}
      />
      <div className='grid gap-4'>
        <Card>
          <CardContent>
            <div className='grid grid-cols-12 gap-2 md:gap-4 lg:gap-10'>
              {/* Hình ảnh sản phẩm */}
              <div className='col-span-12 md:col-span-6 lg:col-span-5'>
                <ProductDetailPhotos product={product} />
              </div>
              {/* Thông tin sản phẩm */}
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
                {product.isActive && <ProductDetailActions product={product} />}
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
          {/* Mô tả */}
          <Card className='flex-1'>
            <CardHeader>
              <CardTitle className='text-xl'>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductDetailDescription descHtml={product.description} />
            </CardContent>
          </Card>
          {/* Bài viết đề xuất */}
          <Card className='basis-full lg:basis-1/3'>
            <CardHeader>
              <CardTitle className='text-xl'>Bài viết</CardTitle>
              <CardAction>
                <Button asChild variant='link' className='p-0 text-highlight'>
                  <Link href={PATH.BLOGS}>Xem thêm</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className='space-y-4'>
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={PATH.BLOGS_DETAIL({
                    name: blog.title,
                    id: blog._id
                  })}
                  className='flex items-center space-x-2'
                >
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
        {/* Sản phẩm cùng danh mục */}
        {relatedProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Sản phẩm cùng danh mục</CardTitle>
              <CardAction>
                <Button asChild variant='link' className='text-main dark:text-main-foreground'>
                  <Link href={`${PATH.PRODUCTS}?categoryIds=${product.category._id}`}>Xem thêm</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ProductsList products={relatedProducts} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
