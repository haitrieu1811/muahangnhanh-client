'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

import addressesApis from '@/apis/addresses.apis'
import CartList from '@/app/(shop)/cart/list'
import OrderInfo from '@/app/(shop)/cart/order-info'
import CartStep from '@/app/(shop)/cart/step'
import { ShippingMethod } from '@/constants/enum'
import { Address } from '@/types/addresses.types'
import OrderPreview from '@/app/(shop)/cart/order-preview'
import OrderSuccess from '@/app/(shop)/cart/order-success'

export type CartStepType = 'list' | 'info' | 'preview' | 'success'

type CartContextType = {
  step: CartStepType
  setStep: React.Dispatch<React.SetStateAction<CartStepType>>
  orderAddress: Address | null
  setOrderAddress?: React.Dispatch<React.SetStateAction<Address | null>>
  handePrevStep: () => void
  handleSelectAddress: ({ address, onSuccess }: { address: Address; onSuccess?: () => void }) => void
  addresses: Address[]
  shippingMethod: ShippingMethod
  setShippingMethod: React.Dispatch<React.SetStateAction<ShippingMethod>>
  note: string
  setNote: React.Dispatch<React.SetStateAction<string>>
  shippingFee: number
}

const defaultCartContext: CartContextType = {
  step: 'list',
  setStep: () => {},
  handePrevStep: () => {},
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

export const CartContext = React.createContext<CartContextType>(defaultCartContext)

export default function Cart() {
  const [step, setStep] = React.useState<CartStepType>(defaultCartContext.step)
  const [orderAddress, setOrderAddress] = React.useState<Address | null>(defaultCartContext.orderAddress)
  const [shippingMethod, setShippingMethod] = React.useState<ShippingMethod>(ShippingMethod.Normal)
  const [note, setNote] = React.useState<string>('')

  // Hàm xử lý khi người dùng nhấn nút "Quay lại"
  const handePrevStep = () => {
    if (step === 'info') {
      setStep('list')
    } else if (step === 'preview') {
      setStep('info')
    }
    // Không có bước lùi từ 'success'
  }

  // Lấy danh sách địa chỉ của người dùng
  const getMyAddressesQuery = useQuery({
    queryKey: ['get-my-addresses'],
    queryFn: () => addressesApis.getMyAddressesFromNextClientToServer(),
    enabled: step === 'info' // Chỉ lấy địa chỉ khi ở bước 'info'
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
    <CartContext.Provider
      value={{
        step,
        setStep,
        handePrevStep,
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
      <div className='space-y-2'>
        <CartStep />
        {step === 'list' && <CartList />}
        {step === 'info' && <OrderInfo />}
        {step === 'preview' && <OrderPreview />}
        {step === 'success' && <OrderSuccess />}
      </div>
    </CartContext.Provider>
  )
}
