import http from '@/lib/http'
import {
  GetNotificationsReqQuery,
  GetNotificationsResponse,
  MarkAsReadNotificationsResponse
} from '@/types/notifications.types'

const notificationsApis = {
  getNotifications(query?: GetNotificationsReqQuery) {
    const params = new URLSearchParams(query as Record<string, string>)
    return http.get<GetNotificationsResponse>(`/notifications/me?${params.toString()}`)
  },

  markAsReadNotification(notificationId: string) {
    return http.put<MarkAsReadNotificationsResponse>(`/notifications/${notificationId}/mark-as-read`, {})
  },

  markAsReadAllNotifications() {
    return http.put<MarkAsReadNotificationsResponse>('/notifications/mark-as-read/all', {})
  }
} as const

export default notificationsApis
