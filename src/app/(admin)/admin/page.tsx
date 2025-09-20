import Link from 'next/link'

import LogoutButton from '@/components/logout-button'
import PATH from '@/constants/path'

export default async function AdminPage() {
  return (
    <div>
      AdminPage Xin chào
      <Link href={PATH.ADMIN_ME}>Tài khoản của tôi</Link>
      <LogoutButton />
    </div>
  )
}
