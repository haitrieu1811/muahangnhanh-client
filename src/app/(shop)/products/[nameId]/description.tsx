'use client'

import React from 'react'

import Prose from '@/components/prose'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_HEIGHT = 400 // px

export default function ProductDetailDescription({ descHtml }: { descHtml: string }) {
  const [height, setHeight] = React.useState<number>(0)
  const [isReadMore, setIsReadMore] = React.useState<boolean>(false)

  const descriptionRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!descriptionRef.current) return
    setHeight(descriptionRef.current.offsetHeight)
  }, [descriptionRef])

  const isOverflow = height > MAX_HEIGHT

  return (
    <div
      ref={descriptionRef}
      className={cn('relative', {
        'max-h-[400px] overflow-y-hidden': isOverflow && !isReadMore
      })}
    >
      <Prose html={descHtml} />
      {isOverflow && (
        <div
          className={cn('flex justify-center bg-background', {
            'absolute bottom-0 inset-x-0 before:absolute before:bottom-full before:inset-x-0 before:h-[200%] before:bg-linear-to-b before:from-background/0 before:via-background/40 before:to-background':
              !isReadMore,
            relative: isReadMore
          })}
        >
          <Button
            variant='link'
            className='text-main dark:text-main-foreground'
            onClick={() => setIsReadMore((prevState) => !prevState)}
          >
            {!isReadMore ? 'Đọc tiếp' : 'Thu gọn'} bài viết
          </Button>
        </div>
      )}
    </div>
  )
}
