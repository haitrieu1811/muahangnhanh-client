'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import cartItemsApis from '@/apis/cartItems.apis'
import QuantityController from '@/components/quantity-controller'
import { Button } from '@/components/ui/button'

export default function ProductDetailActions({ productId }: { productId: string }) {
  const queryClient = useQueryClient()

  const [quantity, setQuantity] = React.useState<number>(1)

  const addProductToCartMutation = useMutation({
    mutationKey: ['add-product-to-cart'],
    mutationFn: cartItemsApis.addToCart,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      queryClient.invalidateQueries({
        queryKey: ['get-my-cart']
      })
    }
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <QuantityController
          max={10}
          onDecrease={(value) => setQuantity(value)}
          onIncrease={(value) => setQuantity(value)}
          onBlur={(value) => setQuantity(value)}
          onTyping={(value) => setQuantity(value)}
        />
        <p className='text-sm'>Còn 1 sản phẩm</p>
      </div>
      <div className='flex space-x-2'>
        <Button
          variant='outline'
          disabled={addProductToCartMutation.isPending}
          className='flex-auto border-main dark:border-main-foreground text-main dark:text-main-foreground hover:text-main'
          onClick={() =>
            addProductToCartMutation.mutate({
              productId,
              quantity
            })
          }
        >
          {addProductToCartMutation.isPending && <Loader2 className='animate-spin' />}
          Thêm vào giỏ hàng
        </Button>
        <Button className='flex-auto bg-main dark:bg-main-foreground hover:bg-main/80 dark:hover:bg-main-foreground/80'>
          Mua ngay
        </Button>
      </div>
    </div>
  )
}
