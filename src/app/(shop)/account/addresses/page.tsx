import { cookies } from 'next/headers'

import addressesApis from '@/apis/addresses.apis'
import AddressActions from '@/app/(shop)/account/addresses/address-actions'
import CreateAddressButton from '@/app/(shop)/account/addresses/create-address-button'
import AddressItem from '@/components/address-item'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Address } from '@/types/addresses.types'

export default async function AccountAddressesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let addresses: Address[] = []

  try {
    const res = await addressesApis.getMyAddressesFromNextServerToServer(accessToken)
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
        {/* Danh sách địa chỉ */}
        {addresses.map((address) => (
          <div key={address._id} className='border-b last:border-b-0 py-4 flex justify-between items-center space-x-10'>
            <AddressItem address={address} />
            <AddressActions address={address} />
          </div>
        ))}
        {/* Chưa có địa chỉ nào */}
        {addresses.length === 0 && (
          <div className='text-sm text-muted-foreground'>Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</div>
        )}
      </CardContent>
    </Card>
  )
}
