'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import useLogout from '@/hooks/use-logout'
import { getAccessTokenFromLS } from '@/lib/storage'
import PATH from '@/constants/path'

export default function LogoutPage() {
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
