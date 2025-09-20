'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import usersApis from '@/apis/users.apis'
import PATH from '@/constants/path'
import { clearAuthLS } from '@/lib/storage'

export default function useLogout() {
  const router = useRouter()

  const logoutFromNextClientToNextServer = useMutation({
    mutationKey: ['logout-from-next-client-to-next-server'],
    mutationFn: usersApis.logoutFromNextClientToNextServer,
    onSuccess: () => {
      router.push(PATH.LOGIN)
      router.refresh()
      clearAuthLS()
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
