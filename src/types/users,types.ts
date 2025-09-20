import { UserStatus, UserVerifyStatus } from '@/constants/enum'
import { SuccessResponse, TokensResponse } from '@/types/utils.types'

type User = {
  _id: string
  email: string
  fullName: string
  avatar: string
  avatarId: string
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

export type GetMeResponse = SuccessResponse<{
  user: User
}>
