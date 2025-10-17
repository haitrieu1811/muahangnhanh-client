'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import usersApis from '@/apis/users.apis'
import PATH from '@/constants/path'
import { clearAuthLS } from '@/lib/storage'
import { useAuthStore, useSocket } from '@/providers/app.provider'

export default function useLogout() {
  const router = useRouter()

  const socket = useSocket()
  const { setIsAuthenticated, setUser, setIsHasAccessTokenInCookie } = useAuthStore()

  const logoutFromNextClientToNextServer = useMutation({
    mutationKey: ['logout-from-next-client-to-next-server'],
    mutationFn: usersApis.logoutFromNextClientToNextServer,
    onSuccess: () => {
      clearAuthLS()
      router.push(PATH.LOGIN)
      setUser(null)
      setIsAuthenticated(false)
      setIsHasAccessTokenInCookie(false)
      socket.disconnect()
      router.refresh()
    }
  })

  const handleLogout = () => {
    logoutFromNextClientToNextServer.mutate()
  }

  return {
    logoutFromNextClientToNextServer,
    handleLogout
  }
}
