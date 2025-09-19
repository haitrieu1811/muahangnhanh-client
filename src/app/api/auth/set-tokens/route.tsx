import { NextResponse } from 'next/server'

import { UTILS_MESSAGES } from '@/constants/message'
import { jwtDecode } from '@/lib/utils'

export async function POST(request: Request) {
  const body = await request.json()
  const accessToken = body.accessToken
  const refreshToken = body.refreshToken

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: UTILS_MESSAGES.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_REQUIRED
      },
      {
        status: 401
      }
    )
  }

  const decodedAccessToken = jwtDecode(accessToken)
  const decodedRefreshToken = jwtDecode(refreshToken)

  const response = NextResponse.json(
    {
      message: UTILS_MESSAGES.SET_ACCESS_TOKEN_AND_REFRESH_TOKEN_SUCCESS
    },
    {
      status: 200
    }
  )

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(decodedAccessToken.exp * 1000)
  })
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(decodedRefreshToken.exp * 1000)
  })

  return response
}
