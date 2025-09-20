'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import usersApis from '@/apis/users.apis'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import { clearAuthLS } from '@/lib/storage'

export default function useLogout() {
  const router = useRouter()

  const { setIsAuthenticated, setUser } = useAppContext()

  const logoutFromNextClientToNextServer = useMutation({
    mutationKey: ['logout-from-next-client-to-next-server'],
    mutationFn: usersApis.logoutFromNextClientToNextServer,
    onSuccess: () => {
      clearAuthLS()
      router.push(PATH.LOGIN)
      setIsAuthenticated(false)
      setUser(null)
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
