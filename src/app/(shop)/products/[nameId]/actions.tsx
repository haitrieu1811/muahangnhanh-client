'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import cartItemsApis from '@/apis/cartItems.apis'
import QuantityController from '@/components/quantity-controller'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { useCartStore } from '@/providers/app.provider'
import { ProductType } from '@/types/products.types'

export default function ProductDetailActions({ product }: { product: ProductType }) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const { extendedCartItems, setExtendedCartItems } = useCartStore()

  const [quantity, setQuantity] = React.useState<number>(1)

  const addProductToCartMutation = useMutation({
    mutationKey: ['add-product-to-cart'],
    mutationFn: cartItemsApis.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-my-cart']
      })
    }
  })

  const handleAddProductToCart = () => {
    addProductToCartMutation.mutate(
      {
        productId: product._id,
        quantity
      },
      {
        onSuccess: (data) => {
          toast.success(data.payload.message)
        }
      }
    )
  }

  const handleBuyNow = () => {
    addProductToCartMutation.mutate(
      {
        productId: product._id,
        quantity
      },
      {
        onSuccess: (data) => {
          const { cartItem: resCartItem } = data.payload.data
          const isExistedBefore = extendedCartItems.map((cartItem) => cartItem._id).includes(resCartItem._id)
          const buyNowCartItem = {
            _id: resCartItem._id,
            quantity: resCartItem.quantity,
            unitPrice: resCartItem.unitPrice,
            unitPriceAfterDiscount: resCartItem.unitPriceAfterDiscount,
            createdAt: resCartItem.createdAt,
            updatedAt: resCartItem.updatedAt,
            isChecked: true,
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              priceAfterDiscount: product.priceAfterDiscount,
              thumbnail: product.thumbnail.url,
              isActive: product.isActive,
              isFlashSale: product.isFlashSale,
              createdAt: product.createdAt,
              updatedAt: product.createdAt
            }
          }
          /**
           * Nếu sản phẩm đã nằm trong giỏ hàng mà người dùng ấn mua ngay
           * thì cập nhật thêm số lượng thay vì tạo mới để tránh trùng key,
           * nếu chưa thì đơn giản thêm một cartItem mới vào.
           */
          if (isExistedBefore) {
            setExtendedCartItems(
              extendedCartItems.map((item) => {
                if (item._id === resCartItem._id) return buyNowCartItem
                return {
                  ...item,
                  isChecked: false // Đảm bảo chỉ mua ngay 1 sản phẩm thôi
                }
              })
            )
          } else {
            setExtendedCartItems([
              buyNowCartItem,
              ...extendedCartItems.map((item) => ({
                ...item,
                isChecked: false
              }))
            ])
          }
          router.push(PATH.CART_ORDER_INFO)
        }
      }
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <QuantityController
          max={100}
          onDecrease={(value) => setQuantity(value)}
          onIncrease={(value) => setQuantity(value)}
          onBlur={(value) => setQuantity(value)}
          onTyping={(value) => setQuantity(value)}
        />
      </div>
      <div className='flex space-x-2'>
        <Button
          variant='outline'
          disabled={addProductToCartMutation.isPending}
          className='flex-auto border-main dark:border-main-foreground text-main dark:text-main-foreground hover:text-main'
          onClick={handleAddProductToCart}
        >
          {addProductToCartMutation.isPending && <Loader2 className='animate-spin' />}
          Thêm vào giỏ hàng
        </Button>
        <Button
          disabled={addProductToCartMutation.isPending}
          className='flex-auto bg-main dark:bg-main-foreground hover:bg-main/80 dark:hover:bg-main-foreground/80'
          onClick={handleBuyNow}
        >
          {addProductToCartMutation.isPending && <Loader2 className='animate-spin' />}
          Mua ngay
        </Button>
      </div>
    </div>
  )
}
