'use client'

import { PlusCircle } from 'lucide-react'
import React from 'react'

import CreateAddressForm from '@/app/(shop)/_components/create-address-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function CreateAddressButton() {
  const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false)
  return (
    <React.Fragment>
      <Button variant='outline' size='sm' onClick={() => setIsOpenDialog(true)}>
        <PlusCircle />
        Thêm địa chỉ mới
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateAddressForm onCreateSuccess={() => setIsOpenDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
