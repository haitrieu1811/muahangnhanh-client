'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export default function LogoutButton() {
  const router = useRouter()

  const logoutFromNextClientToNextServer = useMutation({
    mutationKey: ['logout-from-next-client-to-next-server'],
    mutationFn: usersApis.logoutFromNextClientToNextServer,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.push(PATH.LOGIN)
    }
  })

  return <Button onClick={() => logoutFromNextClientToNextServer.mutate()}>Đăng xuất</Button>
}
