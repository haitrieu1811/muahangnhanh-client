'use client'

import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import addressesApis from '@/apis/addresses.apis'
import CreateAddressForm from '@/app/(shop)/_components/create-address-form'
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
import { Address } from '@/types/addresses.types'

export default function AddressActions({ address }: { address: Address }) {
  const router = useRouter()

  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  const setDefaultAddressMutation = useMutation({
    mutationKey: ['set-default-address'],
    mutationFn: addressesApis.setDefaultAddress,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    }
  })

  const deleteAddressMutation = useMutation({
    mutationKey: ['delete-address'],
    mutationFn: addressesApis.deleteAddress,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
    }
  })

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon'>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setIsUpdating(true)}>Cập nhật</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDefaultAddressMutation.mutate(address._id)}>
            Đặt làm mặc định
          </DropdownMenuItem>
          <DropdownMenuItem className='text-destructive hover:text-destructive!' onClick={() => setIsDeleting(true)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cập nhật địa chỉ */}
      <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Cập nhật địa chỉ</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateAddressForm address={address} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Xác nhận xóa địa chỉ */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn muốn xóa địa chỉ này?</AlertDialogTitle>
            <AlertDialogDescription>
              Thông tin địa chỉ sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteAddressMutation.mutate(address._id)}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
