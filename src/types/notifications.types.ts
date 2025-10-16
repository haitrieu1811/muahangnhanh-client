import { PaginationReqQuery, PaginationType, SuccessResponse } from '@/types/utils.types'

export type NotificationPayloadData = { userId: string; content: string; url: string; isRead?: boolean }

export type NotificationType = {
  _id: string
  userId: string
  content: string
  url: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export type GetNotificationsResponse = SuccessResponse<{
  notifications: NotificationType[]
  pagination: PaginationType
}>

export type GetNotificationsReqQuery = PaginationReqQuery & {
  isRead?: string
}
