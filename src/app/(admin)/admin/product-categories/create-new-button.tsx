'use client'

import { PlusCircle } from 'lucide-react'
import React from 'react'

import CreateProductCategoryForm from '@/app/(admin)/_components/create-product-category-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function CreateNewButton() {
  const [isOpenDialog, setIsOpenDialog] = React.useState(false)
  return (
    <React.Fragment>
      <Button variant='outline' onClick={() => setIsOpenDialog(true)}>
        <PlusCircle />
        Thêm danh mục sản phẩm mới
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục sản phẩm mới</DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm onSuccess={() => setIsOpenDialog(false)} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
