import PageTitle from '@/app/(admin)/_components/page-title'
import CreateProductForm from '@/app/(admin)/admin/products/new/create-product-form'

export default function AdminProductNewPage() {
  return (
    <div className='space-y-10'>
      <PageTitle title='Thêm sản phẩm mới' />
      <CreateProductForm />
    </div>
  )
}
