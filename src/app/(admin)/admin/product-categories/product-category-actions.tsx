'use client'

import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import CreateProductCategoryForm from '@/app/(admin)/_components/create-product-category-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ProductCategoryType } from '@/types/products.types'

export default function ProductCategoryActions({ productCategory }: { productCategory: ProductCategoryType }) {
  const router = useRouter()

  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  const deleteProductMutation = useMutation({
    mutationKey: ['delete-product'],
    mutationFn: productsApis.deleteProduct,
    onSuccess: (data) => {
      router.refresh()
      toast.success(data.payload.message)
    }
  })

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='outline'>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setIsUpdating(true)}>Chi tiết</DropdownMenuItem>
          <DropdownMenuItem className='text-destructive hover:text-destructive!' onClick={() => setIsDeleting(true)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cập nhật */}
      <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{productCategory.name}</DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm productCategory={productCategory} onUpdateSuccess={() => setIsUpdating(false)} />
        </DialogContent>
      </Dialog>

      {/* Xác nhận xóa */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn muốn xóa sản phẩm này?</AlertDialogTitle>
            <AlertDialogDescription>
              Dữ liệu sản phẩm sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProductMutation.mutate(productCategory._id)}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
