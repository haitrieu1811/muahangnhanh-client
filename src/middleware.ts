import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { UserRole } from '@/constants/enum'
import PATH from '@/constants/path'
import { jwtDecode, normalizePath } from '@/lib/utils'

const adminPaths = [PATH.ADMIN]
const authPaths = ['/auth']
const privatePaths = [PATH.ACCOUNT, PATH.CART]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')
  const decodedAccessToken = jwtDecode(accessToken?.value ?? '')

  // Trang admin - có tài khoản admin mới vào được
  if (adminPaths.map((item) => normalizePath(item)).some((path) => normalizePath(pathname).startsWith(path))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
    if (accessToken && decodedAccessToken.userRole !== UserRole.Admin) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
  }

  // Trang cá nhân - phải đăng nhập mới vào được
  if (privatePaths.map((item) => normalizePath(item)).some((path) => normalizePath(pathname).startsWith(path))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
  }

  // Trang authenticate - đăng nhập rồi thì không vào được
  if (
    authPaths.map((item) => normalizePath(item)).some((path) => normalizePath(pathname).startsWith(path)) &&
    accessToken
  ) {
    return NextResponse.redirect(new URL(PATH.HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/account/:path*', '/cart/:path*']
}
