'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function OrderDetailBackButton() {
  const router = useRouter()
  return (
    <Button variant='link' className='text-highlight p-0' onClick={() => router.back()}>
      Quay lại
    </Button>
  )
}
