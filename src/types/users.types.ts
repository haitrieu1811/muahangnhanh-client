import { UserRole, UserStatus, UserVerifyStatus } from '@/constants/enum'
import { RegisterSchema } from '@/rules/users.rules'
import { SuccessResponse, TokensResponse } from '@/types/utils.types'

export type User = {
  _id: string
  email: string
  fullName: string
  avatar: string
  avatarId: string | null
  status: UserStatus
  verifyStatus: UserVerifyStatus
  createdAt: string
  updatedAt: string
}

export type LoginResponse = SuccessResponse<
  TokensResponse & {
    user: User
  }
>

export type RegisterResponse = LoginResponse

export type GetMeResponse = SuccessResponse<{
  user: User
}>

export type RegisterReqBody = RegisterSchema & {
  role: UserRole
}

export type ChangePasswordReqBody = {
  oldPassword: string
  password: string
  confirmPassword: string
}

export type ChangePasswordResponse = SuccessResponse<{
  user: {
    _id: string
    email: string
    fullName: string
    createdAt: string
    updatedAt: string
  }
}>
