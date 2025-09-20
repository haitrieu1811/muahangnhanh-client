'use client'

import { Button } from '@/components/ui/button'
import useLogout from '@/hooks/use-logout'

export default function LogoutButton() {
  const { handleLogout } = useLogout()
  return <Button onClick={handleLogout}>Đăng xuất</Button>
}
