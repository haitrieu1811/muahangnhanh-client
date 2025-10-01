import productsApis from '@/apis/products.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import ProductVariants from '@/app/(admin)/admin/products/[id]/product-variants'
import CreateProductForm from '@/app/(admin)/admin/products/new/create-product-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
      <Tabs defaultValue='info'>
        <TabsList>
          <TabsTrigger value='info'>Thông tin</TabsTrigger>
          <TabsTrigger value='variants'>Biến thể sản phẩm</TabsTrigger>
        </TabsList>
        <TabsContent value='info'>
          <CreateProductForm product={product} productCategories={productCategories} />
        </TabsContent>
        <TabsContent value='variants'>
          <ProductVariants />
        </TabsContent>
      </Tabs>
    </div>
  )
}
