'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

import { Input } from '@/components/ui/input'

export default function AdminProductsSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('name', term)
    } else {
      params.delete('name')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 1000)

  return (
    <Input
      placeholder='Tìm kiếm sản phẩm'
      defaultValue={searchParams.get('name')?.toString()}
      className='w-[240px]'
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
