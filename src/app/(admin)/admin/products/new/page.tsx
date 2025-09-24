import productsApis from '@/apis/products.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import CreateProductForm from '@/app/(admin)/admin/products/new/create-product-form'
import { ProductCategoryType } from '@/types/products.types'

export default async function AdminProductNewPage() {
  let productCategories: ProductCategoryType[] = []

  try {
    const res = await productsApis.getProductCategories()
    productCategories = res.payload.data.productCategories
  } catch {}

  return (
    <div className='space-y-10'>
      <PageTitle title='Thêm sản phẩm mới' />
      <CreateProductForm productCategories={productCategories} />
    </div>
  )
}
