import http from '@/lib/http'
import { LoginSchema } from '@/rules/users.rules'
import {
  ChangePasswordReqBody,
  GetMeResponse,
  LoginResponse,
  RegisterReqBody,
  RegisterResponse,
  ResetPasswordReqBody
} from '@/types/users.types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_ROUTE_HANDLER = '/api/auth/login'
export const REGISTER_ROUTE_HANDLER = '/api/auth/register'
export const UPDATE_ME_API_ENDPOINT = '/users/me'
export const LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT = '/api/auth/logout'
export const RESET_PASSWORD_ROUTE_HANDLER = '/api/auth/reset-password'
export const RESET_PASSWORD_API_ENDPOINT = '/users/reset-password'

const usersApis = {
  // Đăng nhập từ NextJS server tới server backend
  loginFromNextServerToServer(body: LoginSchema) {
    return http.post<LoginResponse>('/users/login', body)
  },

  // Đăng nhập từ NextJS client tới NextJS server
  loginFromNextClientToNextServer(body: LoginSchema) {
    return http.post<LoginResponse>(LOGIN_ROUTE_HANDLER, body, {
      baseUrl: ''
    })
  },

  // Đăng ký từ NextJS server tới Server backend
  registerFromNextServerToServer(body: RegisterReqBody) {
    return http.post<RegisterResponse>('/users/register', body)
  },

  // Đăng ký từ NextJS client tới NextJS server
  registerFromNextClientToNextServer(body: RegisterReqBody) {
    return http.post<RegisterResponse>(REGISTER_ROUTE_HANDLER, body, {
      baseUrl: ''
    })
  },

  setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
    return http.post<OnlyMessageResponse>(
      '/api/auth/set-tokens',
      {
        accessToken,
        refreshToken
      },
      {
        baseUrl: ''
      }
    )
  },

  logoutFromNextClientToNextServer() {
    return http.post<OnlyMessageResponse>(
      LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT,
      {},
      {
        baseUrl: ''
      }
    )
  },

  logoutFromNextServerToServer(refreshToken: string) {
    return http.post<OnlyMessageResponse>('/users/logout', {
      refreshToken
    })
  },

  getMe(accessToken: string) {
    return http.get<GetMeResponse>('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  updateMe(body: { fullName: string; avatar?: string }) {
    return http.put<GetMeResponse>(UPDATE_ME_API_ENDPOINT, body)
  },

  changePassword(body: ChangePasswordReqBody) {
    return http.post<GetMeResponse>('/users/change-password', body)
  },

  forgotPassword(email: string) {
    return http.post<OnlyMessageResponse>('/users/forgot-password', { email })
  },

  resetPasswordFromNextServerToServer(body: ResetPasswordReqBody) {
    return http.post<LoginResponse>(RESET_PASSWORD_API_ENDPOINT, body)
  },

  resetPasswordFromNextClientToNextServer(body: ResetPasswordReqBody) {
    return http.post<LoginResponse>(RESET_PASSWORD_ROUTE_HANDLER, body, {
      baseUrl: ''
    })
  }
} as const

export default usersApis
