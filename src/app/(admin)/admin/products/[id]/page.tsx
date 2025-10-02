import productsApis from '@/apis/products.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import AdminProductDetailTabs from '@/app/(admin)/admin/products/[id]/tabs'
import { ProductCategoryType, ProductType } from '@/types/products.types'

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product: ProductType | undefined = undefined
  let productCategories: ProductCategoryType[] = []

  try {
    const [getProductDetailRes, getProductCategoriesRes] = await Promise.all([
      productsApis.getProduct(id),
      productsApis.getProductCategories()
    ])
    product = getProductDetailRes.payload.data.product
    productCategories = getProductCategoriesRes.payload.data.productCategories
  } catch {}

  if (!product) return null

  return (
    <div className='space-y-10'>
      <PageTitle title={product.name} />
      <AdminProductDetailTabs product={product} productCategories={productCategories} />
    </div>
  )
}
