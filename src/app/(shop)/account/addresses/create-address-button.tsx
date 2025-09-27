'use client'

import { PlusCircle } from 'lucide-react'
import React from 'react'

import CreateAddressForm from '@/app/(shop)/_components/create-address-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HttpResponse } from '@/lib/http'
import { CreateAddressResponse } from '@/types/addresses.types'

export default function CreateAddressButton({
  onCreateSuccess
}: {
  onCreateSuccess?: (data: HttpResponse<CreateAddressResponse>) => void
}) {
  const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false)
  return (
    <React.Fragment>
      <Button type='button' variant='outline' size='sm' onClick={() => setIsOpenDialog(true)}>
        <PlusCircle />
        Thêm địa chỉ mới
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            <DialogDescription>
              Vui lòng điền đầy đủ thông tin để tạo địa chỉ mới cho tài khoản của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <CreateAddressForm
              onCreateSuccess={(data) => {
                setIsOpenDialog(false)
                onCreateSuccess?.(data)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
