import http, { HttpResponse } from '@/lib/http'
import { LoginSchema } from '@/rules/users.rules'
import {
  ChangePasswordReqBody,
  GetMeResponse,
  LoginResponse,
  RegisterReqBody,
  RegisterResponse,
  ResetPasswordReqBody
} from '@/types/users.types'
import { OnlyMessageResponse, RefreshTokenResponse } from '@/types/utils.types'

export const LOGIN_ROUTE_HANDLER = '/api/auth/login'
export const REGISTER_ROUTE_HANDLER = '/api/auth/register'
export const UPDATE_ME_API_ENDPOINT = '/users/me'
export const LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT = '/api/auth/logout'
export const REFRESH_TOKEN_ROUTE_HANDLER = '/api/auth/refresh-token'
export const RESET_PASSWORD_ROUTE_HANDLER = '/api/auth/reset-password'
export const RESET_PASSWORD_API_ENDPOINT = '/users/reset-password'

let refreshTokenRouteHandlerRequest: null | Promise<HttpResponse<RefreshTokenResponse>> = null

const usersApis = {
  loginFromNextServerToServer(body: LoginSchema) {
    return http.post<LoginResponse>('/users/login', body)
  },

  loginFromNextClientToNextServer(body: LoginSchema) {
    return http.post<LoginResponse>(LOGIN_ROUTE_HANDLER, body, {
      baseUrl: ''
    })
  },

  registerFromNextServerToServer(body: RegisterReqBody) {
    return http.post<RegisterResponse>('/users/register', body)
  },

  registerFromNextClientToNextServer(body: RegisterReqBody) {
    return http.post<RegisterResponse>(REGISTER_ROUTE_HANDLER, body, {
      baseUrl: ''
    })
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

  refreshTokenFromNextServerToServer(refreshToken: string) {
    return http.post<RefreshTokenResponse>('/users/refresh-token', {
      refreshToken
    })
  },

  async refreshTokenFromNextClientToNextServer() {
    if (refreshTokenRouteHandlerRequest) {
      return refreshTokenRouteHandlerRequest
    }
    refreshTokenRouteHandlerRequest = http.post<RefreshTokenResponse>(
      REFRESH_TOKEN_ROUTE_HANDLER,
      {},
      {
        baseUrl: ''
      }
    )
    const result = await refreshTokenRouteHandlerRequest
    refreshTokenRouteHandlerRequest = null
    return result
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
