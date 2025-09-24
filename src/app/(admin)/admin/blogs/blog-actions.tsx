'use client'

import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import blogsApis from '@/apis/blogs.apis'
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

export default function BlogActions({ blogId }: { blogId: string }) {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  const deleteBlogMutation = useMutation({
    mutationKey: ['delete-blog'],
    mutationFn: blogsApis.deleteBlog,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
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
            <Link href={PATH.ADMIN_BLOGS_DETAIL(blogId)}>Chi tiết</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-destructive hover:text-destructive!' onClick={() => setIsDeleting(true)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Xác nhận xóa */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn muốn xóa bài viết này?</AlertDialogTitle>
            <AlertDialogDescription>
              Dữ liệu bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteBlogMutation.mutate(blogId)}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
