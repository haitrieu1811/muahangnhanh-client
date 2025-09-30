'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import ordersApis from '@/apis/orders.apis'
import { ORDER_STATUSES } from '@/components/order-badges'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatus } from '@/constants/enum'

export default function UpdateStatus({ defaultValue, orderId }: { defaultValue: OrderStatus; orderId: string }) {
  const router = useRouter()

  const updateOrderMutation = useMutation({
    mutationKey: ['update-order'],
    mutationFn: ordersApis.updateOrder,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
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
