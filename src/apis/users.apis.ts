import http from '@/lib/http'
import { LoginSchema } from '@/rules/users.rules'
import { LoginResponse } from '@/types/users,types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_API_ENDPOINT = '/users/login'

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
  }
} as const

export default usersApis
