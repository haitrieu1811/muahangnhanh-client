import { cookies } from 'next/headers'

import usersApis from '@/apis/users.apis'
import { jwtDecode } from '@/lib/utils'
import { RegisterReqBody } from '@/types/users.types'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const body = (await request.json()) as RegisterReqBody
  try {
    const res = await usersApis.registerFromNextServerToServer(body)
    const { accessToken: resAccessToken, refreshToken: resRefreshToken } = res.payload.data
    const decodedAccessToken = jwtDecode(resAccessToken)
    const decodedRefreshToken = jwtDecode(resRefreshToken)
    cookieStore.set('accessToken', resAccessToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      expires: decodedAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', resRefreshToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      expires: decodedRefreshToken.exp * 1000
    })
    return Response.json(res.payload, {
      status: res.status
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      error?.payload ?? {
        message: error?.message ?? 'Lỗi không xác định.'
      },
      {
        status: error?.status ?? 500
      }
    )
  }
}
