import productsApis from '@/apis/products.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import CreateProductForm from '@/app/(admin)/admin/products/new/create-product-form'
import { ProductType } from '@/types/products.types'
import React from 'react'

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product: ProductType | undefined = undefined

  try {
    const res = await productsApis.getProduct(id)
    product = res.payload.data.product
  } catch {}

  if (!product) return null

  return (
    <div className='space-y-10'>
      <PageTitle title={product.name} />
      <CreateProductForm product={product} />
    </div>
  )
}
