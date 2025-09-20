import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function InputPassword({ className, ...props }: React.ComponentProps<'input'>) {
  const [type, setType] = React.useState<'text' | 'password'>('password')

  const handleToggleType = () => {
    setType((prevState) => {
      if (prevState === 'password') return 'text'
      return 'password'
    })
  }

  return (
    <div className='relative'>
      <Input type={type} className={cn('pr-10', className)} {...props} />
      <button
        type='button'
        tabIndex={-1}
        className='absolute inset-y-0 right-0 w-10 flex justify-center items-center'
        onClick={handleToggleType}
      >
        {type === 'password' && <EyeOff className='size-5' />}
        {type === 'text' && <Eye className='size-5' />}
      </button>
    </div>
  )
}
