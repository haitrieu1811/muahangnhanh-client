'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Socket } from 'socket.io-client'
import { create } from 'zustand'

import cartItemsApis from '@/apis/cartItems.apis'
import { socket } from '@/lib/socket'
import { getAccessTokenFromLS, getUserFromLS } from '@/lib/storage'
import { CartItemType } from '@/types/cartItems.types'
import { User } from '@/types/users.types'

type AuthStore = {
  isAuthenticated: boolean
  user: User | null
  isHasAccessTokenInCookie: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setUser: (user: User | null) => void
  setIsHasAccessTokenInCookie: (isHasAccessTokenInCookie: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getUserFromLS(),
  isAuthenticated: !!getAccessTokenFromLS(),
  isHasAccessTokenInCookie: false,
  setUser: (user) => set({ user }),
  setIsHasAccessTokenInCookie: (isHasAccessTokenInCookie) => set({ isHasAccessTokenInCookie }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated })
}))

export const useSocket = create<Socket>(() => socket)

type ExtendedCartItem = CartItemType & {
  isChecked: boolean
}

type CartStore = {
  extendedCartItems: ExtendedCartItem[]
  totalCartItems: number
  totalCartAmount: number
  isLoadingMyCart: boolean
  totalCheckedCartItems: number
  totalCheckedCartAmount: number
  isAllChecked: boolean
  checkedCartItems: ExtendedCartItem[]
  handleCheckAllCartItems: () => void
  setExtendedCartItems: (state: ExtendedCartItem[]) => void
}

export const useCartStore = create<CartStore>((set) => ({
  extendedCartItems: [], // Sản phẩm nằm trong giỏ hàng (được chọn và chưa được chọn)
  totalCartItems: 0, // Tổng sản phẩm nằm trong giỏ hàng (được chọn và chưa được chọn)
  totalCartAmount: 0, // Tổng tiền sản phẩm nằm trong giỏ hàng (được chọn và chưa được chọn)
  isLoadingMyCart: false,
  totalCheckedCartItems: 0, // Tổng sản phẩm được CHỌN trong giỏ hàng
  totalCheckedCartAmount: 0, // Tổng tiền sản phẩm được CHỌN trong giỏ hàng
  checkedCartItems: [], // Sản phẩm được CHỌN trong giỏ hàng
  isAllChecked: false, // Tất cả sản phẩm trong giỏ hàng đều được chọn
  handleCheckAllCartItems: () => {
    set((state) => {
      state.setExtendedCartItems(
        state.extendedCartItems.map((cartItem) => ({
          ...cartItem,
          isChecked: !state.isAllChecked
        }))
      )
      return {}
    })
  },
  setExtendedCartItems: (extendedCartItems) =>
    set(() => {
      const isAllChecked = extendedCartItems.every((cartItem) => cartItem.isChecked)
      const checkedCartItems = extendedCartItems.filter((cartItem) => cartItem.isChecked)
      const totalCheckedCartItems = checkedCartItems.reduce((acc, item) => (acc += item.quantity), 0)
      const totalCheckedCartAmount = extendedCartItems
        .filter((cartItem) => cartItem.isChecked)
        .reduce((acc, cartItem) => (acc += cartItem.quantity * cartItem.product.priceAfterDiscount), 0)
      return { totalCheckedCartAmount, extendedCartItems, isAllChecked, checkedCartItems, totalCheckedCartItems }
    })
}))

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHasAccessTokenInCookie } = useAuthStore()

  // Socket client
  React.useEffect(() => {
    socket.auth = {
      Authorization: `Bearer ${getAccessTokenFromLS()}`
    }

    if (socket.connected) {
      onConnect()
    } else {
      socket.connect()
    }

    function onConnect() {
      console.log(`${socket.id} đã kết nối`)
    }

    function onDisconnect() {
      console.log('Đã ngắt kết nối')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onConnectError(error: any) {
      console.log(`Không thể kết nối với Socket server: `, error?.data)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error')
    }
  }, [isAuthenticated])

  // Fetch thông tin giỏ hàng nếu đã đăng nhập
  const getMyCartQuery = useQuery({
    queryKey: ['get-my-cart'],
    queryFn: () => cartItemsApis.getMyCart(),
    enabled: isHasAccessTokenInCookie
  })

  // Set giá trị mặc định cho giỏ hàng
  React.useEffect(() => {
    if (!getMyCartQuery.data) return
    const { totalItems, totalAmount, cartItems } = getMyCartQuery.data.payload.data
    const { extendedCartItems } = useCartStore.getState()
    useCartStore.setState({
      totalCartItems: totalItems,
      totalCartAmount: totalAmount,
      extendedCartItems: cartItems.map((cartItem) => ({
        ...cartItem,
        isChecked: extendedCartItems
          .filter((item) => item.isChecked)
          .map((item) => item._id)
          .includes(cartItem._id)
      }))
    })
  }, [getMyCartQuery.data])

  return children
}
