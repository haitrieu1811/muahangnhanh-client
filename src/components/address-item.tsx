import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AddressType } from '@/constants/enum'
import { formatAddress } from '@/lib/utils'
import { Address } from '@/types/addresses.types'

export default function AddressItem({ address }: { address: Address }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center space-x-2'>
        <h3 className='text-sm font-medium'>{address.fullName}</h3>
        <Separator className='w-0.5! h-3!' />
        <span className='text-sm font-medium'>{address.phoneNumber}</span>
      </div>
      <div className='text-sm'>{formatAddress(address)}</div>
      <div className='flex items-center space-x-2'>
        {address.isDefault && <Badge className='bg-main dark:bg-main-foreground'>Mặc định</Badge>}
        <Badge variant='outline'>{address.type === AddressType.Home ? 'Nhà riêng' : 'Cơ quan'}</Badge>
      </div>
    </div>
  )
}
