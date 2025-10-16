/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import useCartContext from '@/hooks/use-cart-context'
import { handleCheckAndRefreshToken } from '@/lib/utils'

const SKIP_PATHS = [
  PATH.LOGIN,
  PATH.REGISTER,
  PATH.LOGOUT,
  PATH.FORGOT_PASSWORD,
  PATH.FORGOT_RESET_PASSWORD,
  PATH.REFRESH_TOKEN
] as string[]

const TIMEOUT = 1000

export default function RefreshToken() {
  const router = useRouter()
  const pathname = usePathname()

  const { setEnableFetchMyCart } = useCartContext()
  const { setIsAuthenticated, setUser } = useAppContext()

  React.useEffect(() => {
    // Bỏ qua các trang không cần refresh token
    if (SKIP_PATHS.includes(pathname)) return

    let interval: any = null

    // Khởi tạo chạy lần đầu
    handleCheckAndRefreshToken({
      onSuccess: () => {
        setEnableFetchMyCart(true)
      },
      onError: () => {
        setIsAuthenticated(false)
        setUser(null)
        router.push(PATH.LOGIN)
        clearInterval(interval)
      },
      onValidToken: () => {
        setEnableFetchMyCart(true)
      }
    })

    interval = setInterval(
      () =>
        handleCheckAndRefreshToken({
          onError: () => {
            setUser(null)
            setIsAuthenticated(false)
            router.push(PATH.LOGIN)
            clearInterval(interval)
          }
        }),
      TIMEOUT
    )

    return () => {
      clearInterval(interval)
    }
  }, [pathname, router, setIsAuthenticated, setUser, setEnableFetchMyCart])

  return null
}
