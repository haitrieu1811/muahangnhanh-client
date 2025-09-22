import { MediaType, UserRole, UserStatus, UserVerifyStatus } from '@/constants/enum'

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

export type ImageType = {
  _id: string
  url: string
  createdAt: string
  updatedAt: string
}

export type PaginationType = {
  page: number
  skip: number
  totalRows: number
  totalPages: number
}

export type GetImagesResponse = SuccessResponse<{
  images: ImageType[]
  pagination: PaginationType
}>

export type PaginationReqQuery = {
  page?: number
  limit?: number
}

export type UploadImagesResponse = SuccessResponse<{
  medias: {
    _id: string
    name: string
    type: MediaType
    url: string
  }[]
}>
