import { BlogStatus } from '@/constants/enum'
import { PaginationType, SuccessResponse } from '@/types/utils.types'

export type BlogType = {
  _id: string
  thumbnail: {
    _id: string
    url: string
  }
  title: string
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  content: string
  order: number
  status: BlogStatus
  createdAt: string
  updatedAt: string
}

export type GetBlogsResponse = SuccessResponse<{
  blogs: BlogType[]
  pagination: PaginationType
}>
