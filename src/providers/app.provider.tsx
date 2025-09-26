'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import cartItemsApis from '@/apis/cartItems.apis'
import { getAccessTokenFromLS, getUserFromLS } from '@/lib/storage'
import { CartItemType } from '@/types/cartItems.types'
import { User } from '@/types/users.types'

type ExtendedCartItem = CartItemType & {
  isChecked: boolean
}

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>

  extendedCartItems: ExtendedCartItem[]
  setExtendedCartItems: React.Dispatch<React.SetStateAction<ExtendedCartItem[]>>
  totalCartItems: number
  totalCartAmount: number
  isLoadingMyCart: boolean
  totalCheckedCartItems: number
  totalCheckedCartAmount: number
  handleCheckAllCartItems: () => void
  isAllChecked: boolean
}

const initialAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: () => null,
  user: getUserFromLS(),
  setUser: () => null,

  extendedCartItems: [],
  setExtendedCartItems: () => null,
  totalCartItems: 0,
  totalCartAmount: 0,
  isLoadingMyCart: false,
  totalCheckedCartItems: 0,
  totalCheckedCartAmount: 0,
  handleCheckAllCartItems: () => null,
  isAllChecked: false
}

export const AppContext = React.createContext<AppContext>(initialAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [user, setUser] = React.useState<User | null>(initialAppContext.user)

  const [extendedCartItems, setExtendedCartItems] = React.useState(initialAppContext.extendedCartItems)

  const getMyCartQuery = useQuery({
    queryKey: ['get-my-cart'],
    queryFn: () => cartItemsApis.getMyCart(),
    enabled: isAuthenticated
  })

  const cartItems = React.useMemo(
    () => getMyCartQuery.data?.payload.data.cartItems ?? [],
    [getMyCartQuery.data?.payload.data.cartItems]
  )

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
  const totalCheckedCartItems = React.useMemo(
    () => extendedCartItems.filter((cartItem) => cartItem.isChecked).length,
    [extendedCartItems]
  )
  const totalCheckedCartAmount = React.useMemo(
    () =>
      extendedCartItems
        .filter((cartItem) => cartItem.isChecked)
        .reduce((acc, cartItem) => (acc += cartItem.quantity * cartItem.unitPriceAfterDiscount), 0),
    [extendedCartItems]
  )
  const isAllChecked = React.useMemo(
    () => extendedCartItems.every((cartItem) => cartItem.isChecked),
    [extendedCartItems]
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
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,

        extendedCartItems,
        setExtendedCartItems,
        totalCartItems,
        totalCartAmount,
        isLoadingMyCart: getMyCartQuery.isLoading,
        totalCheckedCartItems,
        totalCheckedCartAmount,
        handleCheckAllCartItems,
        isAllChecked
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
