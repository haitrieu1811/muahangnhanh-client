'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import addressesApis from '@/apis/addresses.apis'
import { ShippingMethod } from '@/constants/enum'
import PATH from '@/constants/path'
import { Address } from '@/types/addresses.types'

export type CartStepType = 'list' | 'info' | 'preview' | 'success'

type CheckoutContextType = {
  orderAddress: Address | null
  setOrderAddress?: React.Dispatch<React.SetStateAction<Address | null>>
  handleSelectAddress: ({ address, onSuccess }: { address: Address; onSuccess?: () => void }) => void
  addresses: Address[]
  shippingMethod: ShippingMethod
  setShippingMethod: React.Dispatch<React.SetStateAction<ShippingMethod>>
  note: string
  setNote: React.Dispatch<React.SetStateAction<string>>
  shippingFee: number
}

const defaultCheckoutContext: CheckoutContextType = {
  orderAddress: null,
  setOrderAddress: () => {},
  handleSelectAddress: () => {},
  addresses: [],
  shippingMethod: ShippingMethod.Normal,
  setShippingMethod: () => {},
  note: '',
  setNote: () => {},
  shippingFee: 0
}

export const CheckoutContext = React.createContext<CheckoutContextType>(defaultCheckoutContext)

export default function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const [orderAddress, setOrderAddress] = React.useState<Address | null>(defaultCheckoutContext.orderAddress) // Địa chỉ nhận hàng
  const [shippingMethod, setShippingMethod] = React.useState<ShippingMethod>(ShippingMethod.Normal) // Phương thức vận chuyển
  const [note, setNote] = React.useState<string>('') // Ghi chú đơn hàng

  // Lấy danh sách địa chỉ của người dùng
  const getMyAddressesQuery = useQuery({
    queryKey: ['get-my-addresses'],
    queryFn: () => addressesApis.getMyAddressesFromNextClientToServer(),
    enabled: pathname === PATH.CART_ORDER_INFO // Chỉ lấy địa chỉ khi ở bước điền thông tin đặt hàng
  })

  // Danh sách địa chỉ của người dùng
  const addresses = React.useMemo(
    () => getMyAddressesQuery.data?.payload.data.addresses ?? [],
    [getMyAddressesQuery.data?.payload.data.addresses]
  )

  // Mặc định chọn địa chỉ mặc định của người dùng (nếu có) khi danh sách địa chỉ thay đổi
  React.useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault)
    if (defaultAddress) {
      setOrderAddress(defaultAddress)
    } else {
      setOrderAddress(null)
    }
  }, [addresses])

  // Hàm xử lý khi người dùng chọn một địa chỉ nhận hàng
  const handleSelectAddress = ({ address, onSuccess }: { address: Address; onSuccess?: () => void }) => {
    setOrderAddress(address)
    toast.success('Thay đổi địa chỉ nhận hàng thành công')
    onSuccess?.()
  }

  // Tính phí vận chuyển dựa trên phương thức vận chuyển
  const shippingFee = React.useMemo(() => {
    switch (shippingMethod) {
      case ShippingMethod.Normal:
        return 30000
      case ShippingMethod.Fast:
        return 50000
      default:
        return 30000
    }
  }, [shippingMethod])

  return (
    <CheckoutContext
      value={{
        orderAddress,
        setOrderAddress,
        handleSelectAddress,
        addresses,
        shippingMethod,
        setShippingMethod,
        note,
        setNote,
        shippingFee
      }}
    >
      {children}
    </CheckoutContext>
  )
}
