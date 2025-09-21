import http from '@/lib/http'
import { LoginSchema } from '@/rules/users.rules'
import { GetMeResponse, LoginResponse, RegisterReqBody, RegisterResponse } from '@/types/users.types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_API_ENDPOINT = '/users/login'
export const REGISTER_API_ENDPOINT = '/users/register'
export const LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT = '/api/auth/logout'

const usersApis = {
  login(body: LoginSchema) {
    return http.post<LoginResponse>(LOGIN_API_ENDPOINT, body)
  },

  register(body: RegisterReqBody) {
    return http.post<RegisterResponse>(REGISTER_API_ENDPOINT, body)
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

  updateMe(body: { fullName: string; avatar: string }) {
    return http.put<GetMeResponse>('/users/me', body)
  }
} as const

export default usersApis
