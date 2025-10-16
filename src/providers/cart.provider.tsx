'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import cartItemsApis from '@/apis/cartItems.apis'
import { CartItemType } from '@/types/cartItems.types'

type ExtendedCartItem = CartItemType & {
  isChecked: boolean
}

type CartContext = {
  setEnableFetchMyCart: React.Dispatch<React.SetStateAction<boolean>>
  extendedCartItems: ExtendedCartItem[]
  setExtendedCartItems: React.Dispatch<React.SetStateAction<ExtendedCartItem[]>>
  totalCartItems: number
  totalCartAmount: number
  isLoadingMyCart: boolean
  totalCheckedCartItems: number
  totalCheckedCartAmount: number
  handleCheckAllCartItems: () => void
  isAllChecked: boolean
  checkedCartItems: ExtendedCartItem[]
}

const initialCartContext: CartContext = {
  setEnableFetchMyCart: () => null,
  extendedCartItems: [],
  setExtendedCartItems: () => null,
  totalCartItems: 0,
  totalCartAmount: 0,
  isLoadingMyCart: false,
  totalCheckedCartItems: 0,
  totalCheckedCartAmount: 0,
  handleCheckAllCartItems: () => null,
  isAllChecked: false,
  checkedCartItems: []
}

export const CartContext = React.createContext<CartContext>(initialCartContext)

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = React.useState<boolean>(false)

  const [extendedCartItems, setExtendedCartItems] = React.useState(initialCartContext.extendedCartItems)

  const getMyCartQuery = useQuery({
    queryKey: ['get-my-cart'],
    queryFn: () => cartItemsApis.getMyCart(),
    enabled
  })

  const cartItems = React.useMemo(
    () => getMyCartQuery.data?.payload.data.cartItems ?? [],
    [getMyCartQuery.data?.payload.data.cartItems]
  )

  /**
   * Cập nhật giá trị cho extendedCartItems khi refetch lại `my-cart`
   */
  React.useEffect(() => {
    if (cartItems.length === 0) return
    setExtendedCartItems(
      cartItems.map((cartItem) => ({
        ...cartItem,
        isChecked: extendedCartItems
          .filter((item) => item.isChecked)
          .map((item) => item._id)
          .includes(cartItem._id)
      }))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems])

  const totalCartItems = getMyCartQuery.data?.payload.data.totalItems ?? 0
  const totalCartAmount = getMyCartQuery.data?.payload.data.totalAmount ?? 0

  const totalCheckedCartAmount = React.useMemo(
    () =>
      extendedCartItems
        .filter((cartItem) => cartItem.isChecked)
        .reduce((acc, cartItem) => (acc += cartItem.quantity * cartItem.product.priceAfterDiscount), 0),
    [extendedCartItems]
  )
  const isAllChecked = React.useMemo(
    () => extendedCartItems.every((cartItem) => cartItem.isChecked),
    [extendedCartItems]
  )
  const checkedCartItems = React.useMemo(
    () => extendedCartItems.filter((cartItem) => cartItem.isChecked),
    [extendedCartItems]
  )
  const totalCheckedCartItems = React.useMemo(
    () => checkedCartItems.reduce((acc, item) => (acc += item.quantity), 0),
    [checkedCartItems]
  )

  const handleCheckAllCartItems = () => {
    setExtendedCartItems((cartItems) =>
      cartItems.map((cartItem) => ({
        ...cartItem,
        isChecked: !isAllChecked
      }))
    )
  }

  return (
    <CartContext
      value={{
        setEnableFetchMyCart: setEnabled,
        extendedCartItems,
        setExtendedCartItems,
        totalCartItems,
        totalCartAmount,
        isLoadingMyCart: getMyCartQuery.isLoading,
        totalCheckedCartItems,
        totalCheckedCartAmount,
        handleCheckAllCartItems,
        isAllChecked,
        checkedCartItems
      }}
    >
      {children}
    </CartContext>
  )
}
