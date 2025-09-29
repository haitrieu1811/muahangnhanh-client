import { BadgeCheck, BadgeX, Check, Loader, Truck } from 'lucide-react'

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

export default ORDER_BADGES
