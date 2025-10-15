'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

import PATH from '@/constants/path'
import useCartContext from '@/hooks/use-cart-context'
import { getRefreshTokenFromLS } from '@/lib/storage'
import { handleCheckAndRefreshToken } from '@/lib/utils'

function RefreshTokenLogic() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const refreshToken = searchParams.get('refreshToken')
  const redirectPath = searchParams.get('redirect')

  const { setEnabled: setEnabledFetchMyCart } = useCartContext()

  React.useEffect(() => {
    const myRefreshToken = getRefreshTokenFromLS()
    if (refreshToken && refreshToken === myRefreshToken) {
      handleCheckAndRefreshToken({
        onSuccess: () => {
          /**
           * Chuyển hướng ngược lại về trang trước đó truy cập sau khi
           * refresh token thành công để tiếp tục làm việc
           */
          setEnabledFetchMyCart(true)
          router.push(redirectPath ?? PATH.HOME)
        }
      })
    }
  }, [refreshToken, redirectPath, router, setEnabledFetchMyCart])

  return null
}

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshTokenLogic />
    </Suspense>
  )
}
