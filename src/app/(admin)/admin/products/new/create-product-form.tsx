'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, Loader2, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import SelectImages, { ImageStateType } from '@/app/(admin)/_components/select-images'
import UploadImages from '@/app/(admin)/_components/upload-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ProductStatus } from '@/constants/enum'
import { createProductRules, CreateProductSchema } from '@/rules/products.rules'
import { CreateProductReqBody, ProductType } from '@/types/products.types'

export default function CreateProductForm({ product }: { product?: ProductType }) {
  const router = useRouter()

  const isUpdateMode = !!product

  const [thumbnail, setThumbnail] = React.useState<ImageStateType | null>(null)
  const [photos, setPhotos] = React.useState<ImageStateType[]>([])

  React.useEffect(() => {
    if (!product) return
    const { thumbnail, photos } = product
    setThumbnail({
      _id: thumbnail._id,
      url: thumbnail.url
    })
    setPhotos(photos)
  }, [product])

  const createProductMutation = useMutation({
    mutationKey: ['create-product'],
    mutationFn: productsApis.createProduct,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      form.reset()
      setThumbnail(null)
      setPhotos([])
    }
  })

  const updateProductMutation = useMutation({
    mutationKey: ['update-product'],
    mutationFn: productsApis.updateProduct,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      setThumbnail(null)
      setPhotos([])
      router.refresh()
    }
  })

  const isPending = createProductMutation.isPending || updateProductMutation.isPending

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductRules),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ? String(product.price) : '',
      priceAfterDiscount: product?.priceAfterDiscount ? String(product.priceAfterDiscount) : '',
      status: product?.status.toString() ?? ProductStatus.Active.toString()
    }
  })

  const handleMergePhotos = (images: ImageStateType[]) => {
    const filterdImages = images.filter((item) => !photos.map((subItem) => subItem._id).includes(item._id))
    setPhotos((prevState) => [...prevState, ...filterdImages])
  }

  const handleRemovePhoto = (id: string) => {
    setPhotos((prevState) => prevState.filter((item) => item._id !== id))
  }

  const handleSubmit = form.handleSubmit((data) => {
    if (!thumbnail) return
    const body: CreateProductReqBody = {
      ...data,
      price: Number(data.price),
      priceAfterDiscount: Number(data.priceAfterDiscount) || undefined,
      thumbnail: thumbnail._id,
      photos: photos.map((photo) => photo._id),
      status: Number(data.status) || undefined
    }
    // Chế độ tạo mới
    if (!isUpdateMode) {
      createProductMutation.mutate(body)
      return
    }
    // Chế độ cập nhật
    updateProductMutation.mutate({
      body,
      id: product._id
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-12 gap-4'>
          {/* Danh mục - trạng thái */}
          <div className='col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>Danh mục - Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col'>
                          <FormItem className='flex items-center gap-3'>
                            <FormControl>
                              <RadioGroupItem value={ProductStatus.Active.toString()} />
                            </FormControl>
                            <FormLabel className='font-normal'>Hoạt động</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center gap-3'>
                            <FormControl>
                              <RadioGroupItem value={ProductStatus.Inactive.toString()} />
                            </FormControl>
                            <FormLabel className='font-normal'>Tạm dừng</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          {/* Thông tin chung - giá tiền */}
          <div className='col-span-6 grid gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className='space-y-8'>
                {/* Tên */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Mô tả */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Giá tiền</CardTitle>
              </CardHeader>
              <CardContent className='space-y-8'>
                {/* Giá gốc */}
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá gốc</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Giá sau khi giảm */}
                <FormField
                  control={form.control}
                  name='priceAfterDiscount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá sau khi giảm</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          {/* Hình ảnh */}
          <div className='col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-8'>
                {/* Ảnh đại diện */}
                <div className='grid gap-3'>
                  <Label>Ảnh đại diện</Label>
                  {thumbnail && (
                    <Image
                      width={200}
                      height={200}
                      src={thumbnail.url}
                      alt=''
                      className='w-full aspect-square object-cover rounded-md'
                    />
                  )}
                  {!thumbnail && form.formState.isSubmitted && !isUpdateMode && (
                    <p className='text-sm text-destructive'>Ảnh đại diện là bắt buộc.</p>
                  )}
                  <div className='grid gap-2'>
                    <UploadImages />
                    <SelectImages
                      onSubmit={(images) =>
                        setThumbnail({
                          _id: images[0]._id,
                          url: images[0].url
                        })
                      }
                    />
                  </div>
                </div>
                {/* Thư viện ảnh */}
                <div className='grid gap-3'>
                  <Label>Thư viện ảnh</Label>
                  {photos.length > 0 && (
                    <div className='grid grid-cols-12 gap-2'>
                      {photos.map((photo) => (
                        <div key={photo._id} className='col-span-4 relative group'>
                          <Image
                            width={100}
                            height={100}
                            src={photo.url}
                            alt={photo.url}
                            className='w-full aspect-square object-cover rounded-md'
                          />
                          <div className='absolute bottom-0 inset-x-0 bg-background/50 p-1 flex justify-center space-x-1 opacity-0 group-hover:opacity-100 duration-100'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button asChild size='icon' type='button' variant='secondary' className='size-7'>
                                  <Link href={photo.url} target='_blank'>
                                    <Eye className='size-3' />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xem hình ảnh</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size='icon'
                                  type='button'
                                  variant='secondary'
                                  className='size-7'
                                  onClick={() => handleRemovePhoto(photo._id)}
                                >
                                  <Trash className='size-3' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xóa hình ảnh</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className='grid gap-2'>
                    <UploadImages />
                    <SelectImages multiple onSubmit={handleMergePhotos} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='sticky bottom-0 inset-x-0 bg-background flex justify-center p-4 space-x-2'>
          <Button variant='outline'>Hủy bỏ</Button>
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            {!isUpdateMode ? 'Thêm sản phẩm' : 'Lưu lại'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
