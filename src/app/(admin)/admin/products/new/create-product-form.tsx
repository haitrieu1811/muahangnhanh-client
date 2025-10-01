'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, Loader2, PlusCircle, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import CreateProductCategoryForm from '@/app/(admin)/_components/create-product-category-form'
import RichTextEditor from '@/components/rich-text-editor'
import SelectImages, { ImageStateType } from '@/components/select-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import UploadImages from '@/components/upload-images'
import PATH from '@/constants/path'
import { createProductRules, CreateProductSchema } from '@/rules/products.rules'
import { CreateProductReqBody, ProductCategoryType, ProductType } from '@/types/products.types'

export default function CreateProductForm({
  product,
  productCategories
}: {
  product?: ProductType
  productCategories: ProductCategoryType[]
}) {
  const router = useRouter()

  const isUpdateMode = !!product

  const [thumbnail, setThumbnail] = React.useState<ImageStateType | null>(null)
  const [photos, setPhotos] = React.useState<ImageStateType[]>([])
  const [isCreatingCategory, setIsCreatingCategory] = React.useState<boolean>(false)

  //  Đặt lại giá trị của `thumbnail` và `photos khi ở chế độ cập nhật`
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
      router.push(PATH.ADMIN_PRODUCTS)
      router.refresh()
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
      categoryId: product?.categoryId ?? '',
      isFlashSale: product?.isFlashSale ?? false,
      isActive: product?.isActive ?? true
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
      photos: photos.map((photo) => photo._id)
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
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className='flex items-start gap-4'>
            {/* Cấu hình - Hình ảnh */}
            <div className='basis-1/3 grid gap-4'>
              {/* Hình ảnh */}
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh</CardTitle>
                  <CardDescription>Ảnh đại diện và hình ảnh chi tiết sản phẩm</CardDescription>
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
              {/* Cấu hình */}
              <Card>
                <CardHeader>
                  <CardTitle>Cấu hình</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-8'>
                  <div className='grid gap-4'>
                    {/* Trạng thái hoạt động */}
                    <FormField
                      control={form.control}
                      name='isActive'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                          <div className='space-y-0.5'>
                            <FormLabel>Trạng thái hoạt động</FormLabel>
                            <FormDescription>
                              Nếu tắt trạng thái hoạt động, sản phẩm sẽ không được hiển thị cho khách hàng.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Flash sale */}
                    <FormField
                      control={form.control}
                      name='isFlashSale'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                          <div className='space-y-0.5'>
                            <FormLabel>Là flash sale</FormLabel>
                            <FormDescription>
                              Sản phẩm này sẽ được hiển thị ở mục flash sale ở trang chủ.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Danh mục */}
                  <div className='grid gap-2'>
                    <FormField
                      control={form.control}
                      name='categoryId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn một danh mục sản phẩm' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productCategories.map((productCategory) => (
                                <SelectItem key={productCategory._id} value={productCategory._id}>
                                  {productCategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type='button' variant='outline' onClick={() => setIsCreatingCategory(true)}>
                      <PlusCircle />
                      Thêm mới
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Thông tin chung - giá tiền */}
            <Card className='flex-1'>
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
                      <FormDescription>Mặc định nếu không điền thì giá sau khi giảm sẽ bằng giá gốc</FormDescription>
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
                        <RichTextEditor content={field.value} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className='sticky bottom-0 inset-x-0 z-10 bg-background flex justify-center p-4 space-x-2'>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              Quay lại
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='animate-spin' />}
              {!isUpdateMode ? 'Thêm sản phẩm' : 'Lưu lại'}
            </Button>
          </div>
        </form>
      </Form>
      {/* Thên danh mục sản phẩm */}
      <Dialog open={isCreatingCategory} onOpenChange={setIsCreatingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục sản phẩm mới</DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
