import http from '@/lib/http'
import { LoginSchema } from '@/rules/users.rules'
import { LoginResponse } from '@/types/users,types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_API_ENDPOINT = '/users/login'
export const LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT = '/api/auth/logout'

const usersApis = {
  login(body: LoginSchema) {
    return http.post<LoginResponse>(LOGIN_API_ENDPOINT, body)
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
  }
} as const

export default usersApis
