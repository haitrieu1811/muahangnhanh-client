'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductsSort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortBy = searchParams.get('sortBy')
  const orderBy = searchParams.get('orderBy')

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sortBy', value.split('-')[0])
    params.set('orderBy', value.split('-')[1])
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select defaultValue={sortBy ? `${sortBy}-${orderBy}` : ''} onValueChange={handleSort}>
      <SelectTrigger>
        <SelectValue placeholder='Sắp xếp theo' />
      </SelectTrigger>
      <SelectContent align='end'>
        <SelectItem value='priceAfterDiscount-asc'>Giá từ thấp đến cao</SelectItem>
        <SelectItem value='priceAfterDiscount-desc'>Giá từ cao đến thấp</SelectItem>
        <SelectItem value='name-asc'>Tên từ A đến Z</SelectItem>
        <SelectItem value='name-desc'>Tên từ Z đến A</SelectItem>
      </SelectContent>
    </Select>
  )
}
