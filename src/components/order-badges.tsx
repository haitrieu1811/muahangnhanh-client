import { BadgeCheck, BadgeX, Check, CheckCheck, CheckCircle2, Loader, Loader2, Truck, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/constants/enum'

const ORDER_BADGES = {
  [OrderStatus.Waiting]: (
    <Badge className='bg-yellow-500'>
      <Loader />
      Chờ xác nhận
    </Badge>
  ),
  [OrderStatus.Confirmed]: (
    <Badge className='bg-pink-500'>
      <Check />
      Đã xác nhận
    </Badge>
  ),
  [OrderStatus.Delivering]: (
    <Badge className='bg-blue-500'>
      <Truck />
      Đang vận chuyển
    </Badge>
  ),
  [OrderStatus.Success]: (
    <Badge className='bg-green-500'>
      <BadgeCheck />
      Thành công
    </Badge>
  ),
  [OrderStatus.Cancel]: (
    <Badge className='bg-red-500'>
      <BadgeX />
      Đã hủy
    </Badge>
  )
} as const

export const ORDER_STATUSES = [
  { value: '-1', label: 'Tất cả', icon: Loader2 },
  { value: OrderStatus.Waiting.toString(), label: 'Chờ xác nhận', icon: Loader },
  { value: OrderStatus.Confirmed.toString(), label: 'Đã xác nhận', icon: CheckCircle2 },
  { value: OrderStatus.Delivering.toString(), label: 'Đang giao', icon: Truck },
  { value: OrderStatus.Success.toString(), label: 'Đã giao', icon: CheckCheck },
  { value: OrderStatus.Cancel.toString(), label: 'Đã hủy', icon: X }
] as const

export default ORDER_BADGES
