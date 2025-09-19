import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { USERS_MESSAGES } from '@/constants/message'
import usersApis from '@/apis/users.apis'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')

  if (!refreshToken) {
    return Response.json(
      {
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
      },
      {
        status: 401
      }
    )
  }

  try {
    await usersApis.logoutFromNextServerToServer(refreshToken.value)

    const response = NextResponse.json(
      {
        message: USERS_MESSAGES.LOGOUT_SUCCESS
      },
      {
        status: 200
      }
    )

    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.log(error)
    return Response.json(
      {
        message: 'Lỗi không xác định.'
      },
      {
        status: 400
      }
    )
  }
}
