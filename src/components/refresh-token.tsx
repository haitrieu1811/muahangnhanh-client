/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import PATH from '@/constants/path'
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
  const pathname = usePathname()

  React.useEffect(() => {
    // Bỏ qua các trang không cần refresh token
    if (SKIP_PATHS.includes(pathname)) return

    let interval: any = null

    // Khởi tạo chạy lần đầu
    handleCheckAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      }
    })

    interval = setInterval(
      () =>
        handleCheckAndRefreshToken({
          onError: () => {
            clearInterval(interval)
          }
        }),
      TIMEOUT
    )

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
