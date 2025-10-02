'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import CreateBlogForm from '@/app/(admin)/admin/blogs/new/create-blog-form'
import CreateMetadataForm from '@/app/(admin)/admin/products/[id]/create-metadata-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { metadataRules, MetadataSchema } from '@/rules/utils.rules'
import { BlogType } from '@/types/blogs.types'

export default function AdminBlogDetailTabs({ blog }: { blog: BlogType }) {
  const createMetadataForm = useForm<MetadataSchema>({
    resolver: zodResolver(metadataRules),
    defaultValues: {
      title: blog.metadata?.title ?? '',
      description: blog.metadata?.description ?? ''
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
          <CreateBlogForm blog={blog} />
        </TabsContent>
        <TabsContent value='metadata'>
          <CreateMetadataForm documentId={blog._id} metadata={blog.metadata} />
        </TabsContent>
      </Tabs>
    </FormProvider>
  )
}
