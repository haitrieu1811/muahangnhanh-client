import { Metadata } from 'next'
import { cookies } from 'next/headers'

import usersApis from '@/apis/users.apis'
import ProfileForm from '@/app/(admin)/admin/me/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/types/users.types'

export const metadata: Metadata = {
  title: 'Hồ sơ của tôi'
}

export default async function AccountPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let user: User | null = null

  try {
    const res = await usersApis.getMe(accessToken)
    user = res.payload.data.user
  } catch {}

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Hồ sơ của tôi</CardTitle>
        <CardDescription>Quản lý thông tin hồ sơ để bảo mật tài khoản</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm user={user} />
      </CardContent>
    </Card>
  )
}
