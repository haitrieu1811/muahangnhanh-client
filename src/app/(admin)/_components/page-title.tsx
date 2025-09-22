'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function PageTitle({ title, subTitle }: { title: string; subTitle?: string }) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className='flex items-center space-x-4'>
      <Button size='icon' variant='outline' onClick={handleBack}>
        <ChevronLeft />
      </Button>
      <h1 className='font-semibold tracking-tight text-3xl flex items-center space-x-2'>
        <span>{title}</span> {subTitle && <span className='text-base text-muted-foreground'>({subTitle})</span>}
      </h1>
    </div>
  )
}
