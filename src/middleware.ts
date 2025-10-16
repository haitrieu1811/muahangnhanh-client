import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { UserRole } from '@/constants/enum'
import PATH from '@/constants/path'
import { jwtDecode, normalizePath } from '@/lib/utils'

const adminPaths = [PATH.ADMIN]
const authPaths = ['/auth']
const privatePaths = [PATH.ACCOUNT, PATH.CART]

const isPathMatched = (paths: string[], pathname: string) => {
  const normalizedPathname = normalizePath(pathname)
  const normalizedPaths = paths.map((item) => normalizePath(item))
  const isMatched = normalizedPaths.some((path) => normalizedPathname.startsWith(path))
  return isMatched
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  const decodedAccessToken = jwtDecode(accessToken ?? '')

  /**
   * Trang admin:
   * Có tài khoản admin và đăng nhập rồi mới vào được
   */
  if (isPathMatched(adminPaths, pathname)) {
    if (!refreshToken) {
      const url = new URL(PATH.LOGIN, request.url)
      url.searchParams.set('clearTokens', 'true')
      return NextResponse.redirect(url)
    }
    if (refreshToken && accessToken && decodedAccessToken?.userRole !== UserRole.Admin) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
  }

  /**
   * Trang private:
   * Phải đăng nhập mới vào được
   */
  if (isPathMatched(privatePaths, pathname) && !refreshToken) {
    const url = new URL(PATH.LOGIN, request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  /**
   * Trang authenticate:
   * Đăng nhập rồi thì không vào được ngoại trừ trang `refresh-token`
   */
  if (isPathMatched(authPaths, pathname) && refreshToken) {
    return NextResponse.redirect(new URL(PATH.HOME, request.url))
  }

  /**
   * Xử lý trường hợp hết hạn access token nhưng
   * refresh token vẫn còn hạn
   */
  if (isPathMatched([...adminPaths, ...privatePaths], pathname) && !accessToken && refreshToken) {
    const url = new URL(PATH.REFRESH_TOKEN, request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/account/:path*', '/cart/:path*']
}
