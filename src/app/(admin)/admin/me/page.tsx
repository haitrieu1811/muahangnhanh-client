import { cookies } from 'next/headers'

import usersApis from '@/apis/users.apis'

export default async function AdminMePage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  const profile = await usersApis.getMe(accessToken)
  console.log(profile)
  return <div>Admin Me</div>
}
