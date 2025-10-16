'use client'

import { useQuery } from '@tanstack/react-query'
import { Bell, BellRing } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import notificationsApis from '@/apis/notifications.apis'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useAppContext from '@/hooks/use-app-context'
import { cn, dateDistance } from '@/lib/utils'
import { useSocket } from '@/providers/socket.provider'
import { NotificationType } from '@/types/notifications.types'

export default function HeaderNotificationsPopover({ smallTrigger = false }: { smallTrigger?: boolean }) {
  const socket = useSocket()
  const { isHasAccessTokenInCookie } = useAppContext()

  const [totalNotifications, setTotalNotifications] = React.useState<number>(0)
  const [notifications, setNotifications] = React.useState<NotificationType[]>([])

  const getNotificationsQuery = useQuery({
    queryKey: ['get-notifications'],
    queryFn: () => notificationsApis.getNotifications(),
    enabled: isHasAccessTokenInCookie
  })

  React.useEffect(() => {
    if (!getNotificationsQuery.data) return
    setNotifications(getNotificationsQuery.data?.payload.data.notifications)
    setTotalNotifications(getNotificationsQuery.data.payload.data.pagination.totalRows)
  }, [getNotificationsQuery.data])

  React.useEffect(() => {
    socket.on('receive_notification', (payload: { data: NotificationType; from: string }) => {
      setTotalNotifications((prevState) => (prevState += 1))
      setNotifications((prevState) => [payload.data, ...prevState])
    })

    return () => {
      socket.off('receive_notification')
    }
  }, [socket])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size={smallTrigger ? 'icon' : 'default'}>
          <Bell />
          {!smallTrigger && 'Thông báo'}
          {!smallTrigger && totalNotifications > 0 && (
            <Badge className='h-5 min-w-5 rounded-full px-1 tabular-nums bg-main dark:bg-main-foreground'>
              {totalNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-[400px] max-w-screen p-0'>
        {totalNotifications > 0 && (
          <React.Fragment>
            <div className='flex justify-between items-center space-x-10 px-4 py-2'>
              <h3 className='tracking-tight'>Thông báo</h3>
              <Button variant='link' className='text-highlight p-0'>
                Đánh dấu tất cả đã đọc
              </Button>
            </div>
            <div className='max-h-[400px] overflow-y-auto px-2 grid gap-2'>
              {notifications.map((notification) => (
                <Link
                  key={notification._id}
                  href={notification.url}
                  className={cn('flex items-center space-x-4 p-4 rounded-md duration-100', {
                    'hover:bg-muted': notification.isRead,
                    'bg-main/10 dark:bg-main-foreground/10': !notification.isRead
                  })}
                >
                  <BellRing className='stroke-1' />
                  <div className='flex-1'>
                    <h3 className='font-normal text-sm line-clamp-2'>{notification.content}</h3>
                    <p className='text-sm text-muted-foreground'>{dateDistance(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && <div className='size-2 rounded-full bg-highlight' />}
                </Link>
              ))}
            </div>
            <div className='flex justify-center px-4 py-2'>
              <Button variant='link' className='p-0 text-highlight'>
                Quản lý thông báo
              </Button>
            </div>
          </React.Fragment>
        )}
        {totalNotifications === 0 && (
          <div className='flex flex-col justify-center items-center p-4 space-y-2'>
            <Bell className='size-10 stroke-1 text-highlight' />
            <p className='text-center text-sm'>Chưa có thông báo nào.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
