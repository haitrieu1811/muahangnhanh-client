import { cookies } from 'next/headers'

import usersApis from '@/apis/users.apis'
import ProfileForm from '@/app/(admin)/admin/me/profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminMePage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  const res = await usersApis.getMe(accessToken)
  const user = res.payload.data.user

  if (!user) return null

  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-semibold tracking-tight'>{user.fullName}</h2>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
