import { format } from 'date-fns'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import blogsApis from '@/apis/blogs.apis'
import productsApis from '@/apis/products.apis'
import ProductsList from '@/app/(shop)/_components/products-list'
import { baseOpenGraph } from '@/app/shared-metadata'
import BlogItem from '@/components/blog-item'
import Breadcrumb from '@/components/breadcrumb'
import Prose from '@/components/prose'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ENV_CONFIG } from '@/constants/config'
import PATH from '@/constants/path'
import { getIdFromNameId, normalizePath } from '@/lib/utils'
import { BlogType } from '@/types/blogs.types'
import { ProductType } from '@/types/products.types'

export async function generateMetadata({
  params
}: {
  params: Promise<{
    nameId: string
  }>
}): Promise<Metadata> {
  const { nameId } = await params
  const blogId = getIdFromNameId(nameId)
  const res = await blogsApis.getBlog(blogId)
  const blog = res.payload.data.blog
  const path = PATH.BLOGS_DETAIL({
    name: blog.title,
    id: blog._id
  })
  const url = `${ENV_CONFIG.NEXT_PUBLIC_BASE_URL}/${normalizePath(path)}`
  return {
    title: blog.metadata?.title,
    description: blog.metadata?.description,
    openGraph: {
      ...baseOpenGraph,
      title: blog.metadata?.title,
      description: blog.metadata?.description,
      url,
      images: [
        {
          url: blog.thumbnail.url
        }
      ]
    },
    alternates: {
      canonical: path
    }
  }
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{
    nameId: string
  }>
}) {
  const { nameId } = await params
  const blogId = getIdFromNameId(nameId)

  let blog: BlogType | null = null
  let blogs: BlogType[] = []
  let products: ProductType[] = []

  try {
    const [getBlogRes, getBlogsRes, getProductsRes] = await Promise.all([
      blogsApis.getBlog(blogId),
      blogsApis.getBlogs({
        limit: 5
      }),
      productsApis.getProducts({
        limit: 12,
        isFlashSale: true
      })
    ])
    blog = getBlogRes.payload.data.blog
    blogs = getBlogsRes.payload.data.blogs
    products = getProductsRes.payload.data.products
  } catch {}

  if (!blog) return null

  return (
    <div className='container pb-4'>
      <Breadcrumb
        data={[
          {
            name: 'Bài viết',
            path: PATH.BLOGS
          },
          {
            name: blog.title
          }
        ]}
      />
      <div className='grid gap-4'>
        {/* Chi tiết bài viết */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>{blog.title}</CardTitle>
            <CardDescription>{format(blog.createdAt, 'HH:mm dd/MM/yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              width={500}
              height={500}
              src={blog.thumbnail.url}
              alt={blog.title}
              className='w-full md:w-1/2 mx-auto rounded-md object-contain mb-8'
            />
            <Prose html={blog.content} />
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
        {/* Bài viết khác */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Bài viết khác</CardTitle>
            <CardAction>
              <Button asChild variant='link' className='p-0 text-highlight'>
                <Link href={PATH.BLOGS}>Xem thêm</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-12 gap-4'>
              {blogs
                .filter((blog) => blog._id !== blogId)
                .map((blog) => (
                  <div key={blog._id} className='col-span-6 lg:col-span-3'>
                    <BlogItem blog={blog} />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
