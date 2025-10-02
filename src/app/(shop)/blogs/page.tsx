import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import blogsApis from '@/apis/blogs.apis'
import BlogItem from '@/components/blog-item'
import Breadcrumb from '@/components/breadcrumb'
import CustomPagination from '@/components/custom-pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogType } from '@/types/blogs.types'

export default async function BlogsPage({
  searchParams
}: {
  searchParams: Promise<{
    page: string
  }>
}) {
  const { page } = await searchParams

  let blogs: BlogType[] = []
  let totalPages: number = 0
  let totalBlogs: number = 0

  try {
    const res = await blogsApis.getBlogs(
      omitBy(
        {
          page
        },
        isUndefined
      )
    )
    blogs = res.payload.data.blogs
    totalPages = res.payload.data.pagination.totalPages
    totalBlogs = res.payload.data.pagination.totalRows
  } catch {}

  return (
    <div className='container pb-4'>
      <Breadcrumb
        data={[
          {
            name: 'Bài viết'
          }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Tất cả bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          {totalBlogs > 0 && (
            <div className='space-y-8'>
              <div className='grid grid-cols-12 gap-4'>
                {blogs.map((blog) => (
                  <div key={blog._id} className='col-span-12 md:col-span-6 lg:col-span-3'>
                    <BlogItem blog={blog} />
                  </div>
                ))}
              </div>
              <CustomPagination totalPages={totalPages} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
