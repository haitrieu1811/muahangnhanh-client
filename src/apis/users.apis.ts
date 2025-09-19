import http from '@/lib/http'
import { LoginSchema } from '@/rules/users.rules'
import { LoginResponse } from '@/types/users,types'

export const LOGIN_API_ENDPOINT = '/users/login'

const usersApis = {
  login(body: LoginSchema) {
    return http.post<LoginResponse>(LOGIN_API_ENDPOINT, body)
  }
} as const

export default usersApis
