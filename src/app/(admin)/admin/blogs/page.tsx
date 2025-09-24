import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import blogsApis from '@/apis/blogs.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import BlogActions from '@/app/(admin)/admin/blogs/blog-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import { dateDistance } from '@/lib/utils'
import { BlogType } from '@/types/blogs.types'

export default async function AdminBlogsPage() {
  let blogs: BlogType[] = []
  let totalBlogs = 0

  try {
    const res = await blogsApis.getBlogs()
    blogs = res.payload.data.blogs
    totalBlogs = res.payload.data.pagination.totalRows
  } catch {}

  return (
    <div className='space-y-10'>
      <div className='flex justify-between items-center space-x-10'>
        <PageTitle title='Bài viết' subTitle={totalBlogs.toString()} />
        <Button asChild variant='outline'>
          <Link href={PATH.ADMIN_BLOGS_NEW}>
            <PlusCircle />
            Thêm bài viết mới
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          {blogs.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Tạo lúc</TableHead>
                  <TableHead>Cập nhật lúc</TableHead>
                  <TableHead className='text-right'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <Image
                        width={200}
                        height={200}
                        src={blog.thumbnail.url}
                        alt={blog.title}
                        className='size-[50px] aspect-square rounded-md object-cover'
                      />
                    </TableCell>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>{dateDistance(blog.createdAt)}</TableCell>
                    <TableCell>{dateDistance(blog.updatedAt)}</TableCell>
                    <TableCell>
                      <div className='flex justify-end items-center'>
                        <BlogActions blogId={blog._id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {blogs.length === 0 && <p className='text-sm font-medium'>Không tìm thấy bài viết nào.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
