import blogsApis from '@/apis/blogs.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import AdminBlogDetailTabs from '@/app/(admin)/admin/blogs/[id]/tabs'
import { BlogType } from '@/types/blogs.types'

export default async function AdminBlogDetailPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params

  let blog: BlogType | null = null

  try {
    const res = await blogsApis.getBlog(id)
    blog = res.payload.data.blog
  } catch {}

  if (!blog) return null

  return (
    <div className='space-y-10'>
      <PageTitle title={blog.title} />
      <AdminBlogDetailTabs blog={blog} />
    </div>
  )
}
