import { cookies } from 'next/headers'

import usersApis from '@/apis/users.apis'
import PageTitle from '@/app/(admin)/_components/page-title'
import ChangePasswordForm from '@/app/(admin)/admin/me/change-password-form'
import ProfileForm from '@/app/(admin)/admin/me/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/types/users.types'

export default async function AdminMePage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let user: User | undefined = undefined

  try {
    const res = await usersApis.getMe(accessToken)
    user = res.payload.data.user
  } catch {}

  if (!user) return null

  return (
    <div className='space-y-8'>
      <PageTitle title={user.fullName} />
      <Card>
        <CardHeader>
          <CardTitle>Thông tin</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Tuyệt đối không cung cấp mật khẩu cho bất kỳ ai</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
