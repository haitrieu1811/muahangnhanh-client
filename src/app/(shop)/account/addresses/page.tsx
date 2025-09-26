import { cookies } from 'next/headers'

import addressesApis from '@/apis/addresses.apis'
import AddressActions from '@/app/(shop)/account/addresses/address-actions'
import CreateAddressButton from '@/app/(shop)/account/addresses/create-address-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AddressType } from '@/constants/enum'
import { Address } from '@/types/addresses.types'

export default async function AccountAddressesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let addresses: Address[] = []

  try {
    const res = await addressesApis.getMyAddresses(accessToken)
    addresses = res.payload.data.addresses
  } catch {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Địa chỉ của tôi</CardTitle>
        <CardAction>
          <CreateAddressButton />
        </CardAction>
      </CardHeader>
      <CardContent>
        {addresses.map((address) => {
          const { commune, province, fullName, phoneNumber, _id, detail, type, isDefault } = address
          return (
            <div key={_id} className='border-b last:border-b-0 py-4 flex justify-between items-center space-x-10'>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-sm'>{fullName}</h3>
                  <Separator className='w-0.5! h-3!' />
                  <span className='text-sm'>{phoneNumber}</span>
                </div>
                <div className='text-sm text-muted-foreground'>
                  {detail}, {commune.prefix} {commune.name}, {province.prefix} {province.name},
                </div>
                <div className='flex items-center space-x-2'>
                  {isDefault && <Badge className='bg-highlight'>Mặc định</Badge>}
                  <Badge variant='outline'>{type === AddressType.Home ? 'Nhà riêng' : 'Cơ quan'}</Badge>
                </div>
              </div>
              <AddressActions address={address} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
