/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Minus, Plus } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NUMBER_GREATER_THAN_ONE_REGEX } from '@/constants/regex'
import { cn } from '@/lib/utils'

type QuantityControllerProps = {
  size?: 'default' | 'sm'
  defaultValue?: number
  max?: number
  onDecrease?: (value: number) => void
  onIncrease?: (value: number) => void
  onTyping?: (value: number) => void
  onBlur?: (value: number) => void
}

export default function QuantityController({
  size = 'default',
  defaultValue = 1,
  max,
  onDecrease,
  onIncrease,
  onTyping,
  onBlur
}: QuantityControllerProps) {
  const [localValue, setLocalValue] = React.useState<number>(defaultValue)

  const handleDecrease = () => {
    const newValue = localValue - 1
    if (newValue === 0) return
    setLocalValue(newValue)
    onDecrease && onDecrease(newValue)
  }

  const handleIncrease = () => {
    const newValue = localValue + 1
    if (max && newValue > max) return
    setLocalValue(newValue)
    onIncrease && onIncrease(newValue)
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value)
    if (!NUMBER_GREATER_THAN_ONE_REGEX.test(newValue.toString())) return
    if (max && newValue > max) {
      newValue = max
    } else if (newValue < 1) {
      newValue = 1
    }
    setLocalValue(newValue)
    onTyping && onTyping(newValue)
  }

  return (
    <div className='flex items-center space-x-1'>
      <Button
        size='icon'
        variant='outline'
        className={cn('rounded-none', {
          'size-7': size === 'sm'
        })}
        onClick={handleDecrease}
      >
        <Minus
          className={cn({
            'size-4': size === 'sm'
          })}
        />
      </Button>
      <Input
        value={localValue}
        className={cn('text-center rounded-none', {
          'w-[50px]': size === 'default',
          'w-[50px] h-7 text-xs!': size === 'sm'
        })}
        onChange={handleTyping}
        onBlur={() => {
          onBlur && onBlur(localValue)
        }}
      />
      <Button
        size='icon'
        variant='outline'
        className={cn('rounded-none', {
          'size-7': size === 'sm'
        })}
        onClick={handleIncrease}
      >
        <Plus
          className={cn({
            'size-4': size === 'sm'
          })}
        />
      </Button>
    </div>
  )
}
