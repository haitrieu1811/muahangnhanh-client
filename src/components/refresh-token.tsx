/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import usersApis from '@/apis/users.apis'
import PATH from '@/constants/path'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/storage'
import { jwtDecode } from '@/lib/utils'

const SKIP_PATHS = [
  PATH.LOGIN,
  PATH.REGISTER,
  PATH.LOGOUT,
  PATH.FORGOT_PASSWORD,
  PATH.FORGOT_RESET_PASSWORD
] as string[]

const TIMEOUT = 1000

export default function RefreshToken() {
  const pathname = usePathname()

  React.useEffect(() => {
    // Bỏ qua các trang không cần refresh token
    if (SKIP_PATHS.includes(pathname)) return

    let interval: any = null

    const handleCheckAndRefreshToken = async () => {
      const myAccessToken = getAccessTokenFromLS()
      const myRefreshToken = getRefreshTokenFromLS()

      // Chưa đăng nhập thì không cần refresh token
      if (!myAccessToken || !myRefreshToken) return

      const decodedAccessToken = jwtDecode(myAccessToken)
      const decodedRefreshToken = jwtDecode(myRefreshToken)

      /**
       * Lấy ra thời điểm hiện tại theo định dạng epochtime (ms),
       * do access token expires tính theo epochtime giây (s) nên phải chuyển đổi sang giây
       * bằng cách chia cho 1000
       */
      const now = new Date().getTime() / 1000

      // Nếu refresh token hết hạn (hết phiên đăng nhập thì dừng lại)
      if (decodedRefreshToken.exp <= now) return

      /**
       * Thời gian còn lại của AT (access token) = decodedAccessToken.exp - now
       * Thời hạn sử dụng của AT = decodedAccessToken.exp - decodedAccessToken.iat
       * Nếu thời gian còn lại của AT nhỏ hơn 1/3 thời gian sử dụng của AT (với điều kiện refresh
       * token phải còn hạn) thì cho tiến hành refresh token
       * Ví dụ: nếu một AT có hạn sử dụng 30s khi hạn sử dụng 10s thì cho refresh token
       */

      if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        try {
          await usersApis.refreshTokenFromNextClientToNextServer()
        } catch {
          clearInterval(interval)
        }
      }
    }

    // Khởi tạo chạy lần đầu
    handleCheckAndRefreshToken()

    interval = setInterval(handleCheckAndRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
