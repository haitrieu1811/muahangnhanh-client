import http from '@/lib/http'
import { GetNotificationsReqQuery, GetNotificationsResponse } from '@/types/notifications.types'

const notificationsApis = {
  getNotifications(query?: GetNotificationsReqQuery) {
    const params = new URLSearchParams(query as Record<string, string>)
    return http.get<GetNotificationsResponse>(`/notifications/me?${params.toString()}`)
  }
} as const

export default notificationsApis
