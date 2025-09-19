import { UserRole, UserStatus, UserVerifyStatus } from '@/constants/enum'

export type SuccessResponse<Data> = {
  message: string
  data: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors: Data
}

export type OnlyMessageResponse = {
  message: string
}

export type TokensResponse = {
  accessToken: string
  refreshToken: string
}

export type TokenPayload = {
  userId: string
  userRole: UserRole
  userStatus: UserStatus
  userVerifyStatus: UserVerifyStatus
  iat: number
  exp: number
}
