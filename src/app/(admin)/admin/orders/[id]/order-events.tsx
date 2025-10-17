'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Calendar, Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import ordersApis from '@/apis/orders.apis'
import OrderEvents from '@/components/order-events'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { NotificationPayloadData } from '@/types/notifications.types'
import { OrderType } from '@/types/orders.types'
import PATH from '@/constants/path'
import { useSocket } from '@/providers/socket.provider'

const SAMPLE_EVENTS = [
  'Đơn hàng đã được đặt',
  'Đơn hàng đã được xác nhận',
  'Đơn hàng đang được vận chuyển',
  'Đơn hàng đã được giao thành công',
  'Đơn hàng đã bị hủy'
] as const

export default function AdminOrderEvents({ order }: { order: OrderType }) {
  const [content, setContent] = React.useState<string>('')

  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const socket = useSocket()

  const getOrderEventsQuery = useQuery({
    queryKey: ['get-order-events', order._id],
    queryFn: () => ordersApis.getOrderEventsFromNextClientToServer(order._id)
  })

  const orderEvents = React.useMemo(
    () => getOrderEventsQuery.data?.payload.data.orderEvents ?? [],
    [getOrderEventsQuery.data?.payload.data.orderEvents]
  )

  const totalOrderEvents = getOrderEventsQuery.data?.payload.data.totalOrderEvents ?? 0

  const createOrderEventMutation = useMutation({
    mutationKey: ['create-order-event'],
    mutationFn: ordersApis.createOrderEvent,
    onSuccess: (data) => {
      setContent('')
      getOrderEventsQuery.refetch()
      toast.success(data.payload.message)
      const notificationData: NotificationPayloadData = {
        userId: order.userId,
        content: data.payload.data.orderEvent.content,
        url: `${PATH.ACCOUNT_ORDERS_DETAIL(order._id)}`
      }
      socket.emit('send_notification', {
        to: order.userId,
        data: notificationData
      })
    }
  })

  const handleFillSampleEventContent = (content: string) => {
    setContent(content)
    inputRef.current?.focus()
  }

  const handleCreateOrderEvent = () => {
    createOrderEventMutation.mutate({ content, orderId: order._id })
    inputRef.current?.focus()
  }

  const deleteOrderEventMutation = useMutation({
    mutationKey: ['delete-order-event'],
    mutationFn: ordersApis.deleteOrderEvent,
    onSuccess: (data) => {
      getOrderEventsQuery.refetch()
      toast.success(data.payload.message)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dòng thời gian</CardTitle>
        <CardDescription>Bổ sung các sự kiện để người dùng theo dõi đơn hàng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div className='flex items-end space-x-2'>
            <Textarea
              ref={inputRef}
              placeholder='Thêm sự kiện mới'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='resize-none'
            />
            <Button variant='secondary' disabled={createOrderEventMutation.isPending} onClick={handleCreateOrderEvent}>
              {createOrderEventMutation.isPending && <Loader2 className='animate-spin' />}
              Thêm
            </Button>
          </div>
          <div className='flex flex-wrap space-x-1 space-y-1'>
            {SAMPLE_EVENTS.map((sampleEvent) => (
              <Button
                key={sampleEvent}
                variant='outline'
                size='sm'
                onClick={() => handleFillSampleEventContent(sampleEvent)}
              >
                {sampleEvent}
              </Button>
            ))}
          </div>
        </div>
        {/* Danh sách sự kiện */}
        {totalOrderEvents > 0 && !getOrderEventsQuery.isLoading && (
          <div className='mt-8'>
            <OrderEvents orderEvents={orderEvents} deleteOrderEventMutation={deleteOrderEventMutation} />
          </div>
        )}
        {/* Chưa có sự kiện nào */}
        {totalOrderEvents === 0 && !getOrderEventsQuery.isLoading && (
          <div className='flex flex-col justify-center items-center space-y-2 py-10'>
            <Calendar className='stroke-1' />
            <p className='text-sm text-muted-foreground'>Chưa có sự kiện nào</p>
          </div>
        )}
        {/* Loading */}
        {getOrderEventsQuery.isLoading && (
          <div className='flex justify-center items-center py-10'>
            <Loader2 className='animate-spin stroke-1 size-10' />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
