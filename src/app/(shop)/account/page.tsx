import { cookies } from 'next/headers'

import usersApis from '@/apis/users.apis'
import ProfileForm from '@/app/(admin)/admin/me/profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/types/users.types'

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
        <CardTitle className='text-xl'>Thông tin tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm user={user} />
      </CardContent>
    </Card>
  )
}
