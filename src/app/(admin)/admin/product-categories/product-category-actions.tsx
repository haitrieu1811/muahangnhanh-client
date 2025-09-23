'use client'

import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import PATH from '@/constants/path'

export default function ProductCategoryActions({ productCategoryId }: { productCategoryId: string }) {
  const router = useRouter()

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
          <DropdownMenuItem asChild>
            <Link href={PATH.ADMIN_PRODUCTS_DETAIL(productCategoryId)}>Chi tiết</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-destructive hover:text-destructive!' onClick={() => setIsDeleting(true)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            <AlertDialogAction onClick={() => deleteProductMutation.mutate(productCategoryId)}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
