import PageTitle from '@/app/(admin)/_components/page-title'
import CreateBlogForm from '@/app/(admin)/admin/blogs/new/create-blog-form'

export default function AdminBlogNewPage() {
  return (
    <div className='space-y-10'>
      <PageTitle title='Thêm bài viết mới' />
      <CreateBlogForm />
    </div>
  )
}
