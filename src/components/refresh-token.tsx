/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import { handleCheckAndRefreshToken } from '@/lib/utils'

const SKIP_PATHS = [
  PATH.LOGIN,
  PATH.REGISTER,
  PATH.LOGOUT,
  PATH.FORGOT_PASSWORD,
  PATH.FORGOT_RESET_PASSWORD,
  PATH.REFRESH_TOKEN
] as string[]

const TIMEOUT = 1000 * 30 // 30s

export default function RefreshToken() {
  const router = useRouter()
  const pathname = usePathname()

  const { setIsAuthenticated, setUser, setIsHasAccessTokenInCookie } = useAppContext()

  const onError = React.useCallback(
    (interval: NodeJS.Timeout) => {
      setUser(null)
      setIsAuthenticated(false)
      setIsHasAccessTokenInCookie(false)
      router.push(PATH.LOGIN)
      clearInterval(interval)
    },
    [router, setIsAuthenticated, setUser, setIsHasAccessTokenInCookie]
  )

  React.useEffect(() => {
    // Bỏ qua các trang không cần refresh token
    if (SKIP_PATHS.includes(pathname)) return

    let interval: any = null

    // Khởi tạo chạy lần đầu
    handleCheckAndRefreshToken({
      onSuccess: () => {
        setIsHasAccessTokenInCookie(true)
      },
      onError: () => onError(interval),
      onValidToken: () => {
        setIsHasAccessTokenInCookie(true)
      }
    })

    interval = setInterval(
      () =>
        handleCheckAndRefreshToken({
          onError: () => onError(interval)
        }),
      TIMEOUT
    )

    return () => {
      clearInterval(interval)
    }
  }, [pathname, onError, setIsHasAccessTokenInCookie])

  return null
}
