import { UseMutationResult } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Circle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { HttpResponse } from '@/lib/http'
import { cn } from '@/lib/utils'
import { OrderEventType } from '@/types/orders.types'
import { OnlyMessageResponse } from '@/types/utils.types'

export default function OrderEvents({
  orderEvents,
  deleteOrderEventMutation
}: {
  orderEvents: OrderEventType[]
  deleteOrderEventMutation?: UseMutationResult<HttpResponse<OnlyMessageResponse>, Error, string, unknown>
}) {
  return (
    <div className='space-y-2'>
      {orderEvents.map((orderEvent, index) => {
        const isLatest = index === 0
        return (
          <div key={orderEvent._id} className='flex items-start space-x-4 text-sm'>
            <div className='flex items-center space-x-3 w-[160px]'>
              <Circle
                className={cn('size-2.5', {
                  'text-border fill-border': !isLatest,
                  'text-main dark:text-main-foreground fill-main dark:fill-main-foreground': isLatest
                })}
              />
              <div
                className={cn({
                  'text-main dark:text-main-foreground font-medium': isLatest
                })}
              >
                {format(orderEvent.createdAt, 'HH:mm dd/MM/yyyy')}
              </div>
            </div>
            <div
              className={cn('flex-1', {
                'text-muted-foreground': !isLatest,
                'text-main dark:text-main-foreground font-medium': isLatest
              })}
            >
              {orderEvent.content}
            </div>
            {deleteOrderEventMutation && (
              <Button
                variant='link'
                size='sm'
                disabled={deleteOrderEventMutation.isPending && deleteOrderEventMutation.variables === orderEvent._id}
                className='p-0 text-destructive'
                onClick={() => deleteOrderEventMutation.mutate(orderEvent._id)}
              >
                {deleteOrderEventMutation.isPending && deleteOrderEventMutation.variables === orderEvent._id && (
                  <Loader2 className='animate-spin' />
                )}
                Xóa
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
