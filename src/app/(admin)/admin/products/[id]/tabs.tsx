'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import CreateMetadataForm from '@/app/(admin)/admin/products/[id]/create-metadata-form'
import CreateProductForm from '@/app/(admin)/admin/products/new/create-product-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { metadataRules, MetadataSchema } from '@/rules/utils.rules'
import { ProductCategoryType, ProductType } from '@/types/products.types'

export default function AdminProductDetailTabs({
  product,
  productCategories
}: {
  product: ProductType
  productCategories: ProductCategoryType[]
}) {
  const createMetadataForm = useForm<MetadataSchema>({
    resolver: zodResolver(metadataRules),
    defaultValues: {
      title: product.metadata?.title ?? '',
      description: product.metadata?.description ?? ''
    }
  })

  return (
    <FormProvider {...createMetadataForm}>
      <Tabs defaultValue='info'>
        <TabsList>
          <TabsTrigger value='info'>Thông tin</TabsTrigger>
          <TabsTrigger value='metadata'>Metadata (SEO)</TabsTrigger>
        </TabsList>
        <TabsContent value='info'>
          <CreateProductForm product={product} productCategories={productCategories} />
        </TabsContent>
        <TabsContent value='metadata'>
          <CreateMetadataForm documentId={product._id} metadata={product.metadata} />
        </TabsContent>
      </Tabs>
    </FormProvider>
  )
}
