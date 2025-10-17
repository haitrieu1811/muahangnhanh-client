'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import ordersApis from '@/apis/orders.apis'
import { ORDER_STATUSES } from '@/components/order-badges'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import { useAuthStore, useSocket } from '@/providers/app.provider'
import { NotificationPayloadData } from '@/types/notifications.types'

export default function UpdateStatus({ defaultValue, orderId }: { defaultValue: OrderStatus; orderId: string }) {
  const router = useRouter()

  const socket = useSocket()
  const { user } = useAuthStore()

  React.useEffect(() => {
    if (!user) return

    socket.auth = {
      userId: user._id
    }

    if (!socket.connected) {
      socket.connect()
    }

    socket.on('connect', () => {
      console.log(socket.id)
    })

    return () => {
      socket.off('connect')
      socket.disconnect()
    }
  }, [socket, user])

  const updateOrderMutation = useMutation({
    mutationKey: ['update-order'],
    mutationFn: ordersApis.updateOrder,
    onSuccess: (data) => {
      const { order } = data.payload.data
      toast.success(data.payload.message)
      router.refresh()
      const notificationData: NotificationPayloadData = {
        userId: order.userId,
        content: `Đơn hàng có mã đơn #${order.code} của bạn đã được cập nhật trạng thái.`,
        url: `${PATH.ACCOUNT_ORDERS_DETAIL(order._id)}`
      }
      socket.emit('send_notification', {
        to: order.userId,
        data: notificationData
      })
    }
  })

  return (
    <Select
      defaultValue={defaultValue.toString()}
      onValueChange={(value) =>
        updateOrderMutation.mutate({
          orderId,
          status: Number(value)
        })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder='Trạng thái đơn hàng' />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.slice(1).map((order) => (
          <SelectItem key={order.value} value={order.value}>
            {order.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
