import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { UserRole } from '@/constants/enum'
import PATH from '@/constants/path'
import { jwtDecode, normalizePath } from '@/lib/utils'

const adminPaths = [PATH.ADMIN, PATH.ADMIN_ME, PATH.ADMIN_IMAGES, PATH.ADMIN_PRODUCTS, PATH.ADMIN_PRODUCTS_NEW]
const authPaths = [PATH.LOGIN, PATH.REGISTER]
const privatePaths = ['/me']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')
  const decodedAccessToken = jwtDecode(accessToken?.value ?? '')

  // Trang admin - có tài khoản admin mới vào được
  if (adminPaths.map((item) => normalizePath(item)).includes(normalizePath(pathname))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
    if (accessToken && decodedAccessToken.userRole !== UserRole.Admin) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
  }

  // Trang cá nhân - phải đăng nhập mới vào được
  if (privatePaths.map((item) => normalizePath(item)).includes(normalizePath(pathname))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
  }

  // Trang authenticate - đăng nhập rồi thì không vào được
  if (authPaths.map((item) => normalizePath(item)).includes(normalizePath(pathname))) {
    if (accessToken) {
      if (decodedAccessToken.userRole === UserRole.Admin) {
        return NextResponse.redirect(new URL(PATH.ADMIN, request.url))
      } else {
        return NextResponse.redirect(new URL(PATH.HOME, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register']
}
