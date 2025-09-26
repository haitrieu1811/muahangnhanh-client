'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import cartItemsApis from '@/apis/cartItems.apis'
import { getAccessTokenFromLS, getUserFromLS } from '@/lib/storage'
import { CartItemType } from '@/types/cartItems.types'
import { User } from '@/types/users.types'

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  cartItems: CartItemType[]
  totalCartItems: number
  totalCartAmount: number
  isFetchingMyCart: boolean
}

const initialAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: () => null,
  user: getUserFromLS(),
  setUser: () => null,
  cartItems: [],
  totalCartItems: 0,
  totalCartAmount: 0,
  isFetchingMyCart: false
}

export const AppContext = React.createContext<AppContext>(initialAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [user, setUser] = React.useState<User | null>(initialAppContext.user)

  const getMyCartQuery = useQuery({
    queryKey: ['get-my-cart'],
    queryFn: () => cartItemsApis.getMyCart(),
    enabled: isAuthenticated
  })

  const cartItems = React.useMemo(
    () => getMyCartQuery.data?.payload.data.cartItems ?? [],
    [getMyCartQuery.data?.payload.data.cartItems]
  )

  const totalCartItems = getMyCartQuery.data?.payload.data.totalItems ?? 0
  const totalCartAmount = getMyCartQuery.data?.payload.data.totalAmount ?? 0

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        cartItems,
        totalCartItems,
        totalCartAmount,
        isFetchingMyCart: getMyCartQuery.isFetching
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
