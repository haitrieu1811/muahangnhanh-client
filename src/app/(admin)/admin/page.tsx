import usersApis from '@/apis/users.apis'
import { cookies } from 'next/headers'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  const res = await usersApis.getMe(accessToken)
  const { user } = res.payload.data

  return (
    <div>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold'>
          Xin chào {user.fullName.split(' ')[user.fullName.split(' ').length - 1]}
        </h2>
        <p className='text-muted-foreground'>Chào mừng bạn đến với bảng quản trị của bạn</p>
      </div>
    </div>
  )
}
