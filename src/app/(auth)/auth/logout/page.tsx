'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

import PATH from '@/constants/path'
import useLogout from '@/hooks/use-logout'
import { getAccessTokenFromLS } from '@/lib/storage'

function Logout() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')

  const { handleLogout } = useLogout()

  React.useEffect(() => {
    if (accessToken === getAccessTokenFromLS()) {
      handleLogout()
      return
    }
    router.push(PATH.HOME)
  }, [accessToken, handleLogout, router])

  return null
}

export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
