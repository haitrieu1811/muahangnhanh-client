/* eslint-disable @typescript-eslint/no-unused-expressions */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import addressesApis from '@/apis/addresses.apis'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AddressType } from '@/constants/enum'
import { HttpResponse } from '@/lib/http'
import { cn, handleErrorsFromServer } from '@/lib/utils'
import { createAddressRules, CreateAddressSchema } from '@/rules/addresses.rules'
import { Address, CreateAddressReqBody, CreateAddressResponse } from '@/types/addresses.types'

export default function CreateAddressForm({
  address,
  onCreateSuccess,
  onUpdateSuccess
}: {
  address?: Address
  onCreateSuccess?: (data: HttpResponse<CreateAddressResponse>) => void
  onUpdateSuccess?: (data: HttpResponse<CreateAddressResponse>) => void
}) {
  const router = useRouter()

  const isUpdateMode = !!address

  const [isStartChangeProvince, setIsStartChangeProvince] = React.useState<boolean>(false)

  const form = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressRules),
    defaultValues: {
      fullName: address?.fullName ?? '',
      phoneNumber: address?.phoneNumber ?? '',
      detail: address?.detail ?? '',
      type: address?.type.toString() ?? AddressType.Home.toString(),
      provinceId: address?.province._id ?? '',
      communeId: address?.commune._id ?? ''
    }
  })

  const provinceId = form.watch('provinceId')

  /**
   * Nếu đã bắt đầu thay đổi tỉnh/thành thì sau mỗi lần thay đổi
   * sẽ reset lại giá trị của phường/xã
   */
  React.useEffect(() => {
    if (!isStartChangeProvince) return
    form.setValue('communeId', '')
  }, [provinceId, form, isStartChangeProvince])

  const getProvincesQuery = useQuery({
    queryKey: ['get-provinces'],
    queryFn: () => addressesApis.getProvinces(),
    staleTime: Infinity
  })

  const getCommunesQuery = useQuery({
    queryKey: ['get-communes', provinceId],
    queryFn: () => addressesApis.getCommunes(provinceId),
    enabled: !!provinceId
  })

  const provinces = React.useMemo(
    () => getProvincesQuery.data?.payload.data.provinces ?? [],
    [getProvincesQuery.data?.payload.data.provinces]
  )

  const communes = React.useMemo(
    () => getCommunesQuery.data?.payload.data.communes ?? [],
    [getCommunesQuery.data?.payload.data.communes]
  )

  const createAddressMutation = useMutation({
    mutationKey: ['create-address'],
    mutationFn: addressesApis.createAddress,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
      onCreateSuccess && onCreateSuccess(data)
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const updateAddressMutation = useMutation({
    mutationKey: ['update-address'],
    mutationFn: addressesApis.updateAddress,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      router.refresh()
      onUpdateSuccess && onUpdateSuccess(data)
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const isPending = createAddressMutation.isPending || updateAddressMutation.isPending

  const handleSubmit = form.handleSubmit((data) => {
    const body: CreateAddressReqBody = {
      ...data,
      type: Number(data.type)
    }
    // Chế độ tạo mới
    if (!isUpdateMode) {
      createAddressMutation.mutate(body)
      return
    }
    // Chế độ cập nhật
    updateAddressMutation.mutate({
      body,
      addressId: address._id
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        <div className='grid grid-cols-12 gap-4'>
          {/* Tên */}
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Số điện thoại */}
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4'>
          {/* Tỉnh - Thành phố */}
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='provinceId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? `${provinces.find((province) => province._id === field.value)?.prefix} ${provinces.find((province) => province._id === field.value)?.name}`
                            : 'Chọn tỉnh/thành phố'}
                          <ChevronsUpDown className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm...' className='h-9' />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                          <CommandGroup>
                            {provinces.map((province) => (
                              <CommandItem
                                key={province._id}
                                value={province.name}
                                onSelect={() => {
                                  if (!isStartChangeProvince) {
                                    setIsStartChangeProvince(true)
                                  }
                                  form.setValue('provinceId', province._id)
                                }}
                              >
                                {province.prefix} {province.name}
                                <Check
                                  className={cn('ml-auto', province._id === field.value ? 'opacity-100' : 'opacity-0')}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Phường - Xã */}
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='communeId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Phường/Xã</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? `${communes.find((commune) => commune._id === field.value)?.prefix} ${communes.find((commune) => commune._id === field.value)?.name}`
                            : 'Chọn phường/xã'}
                          <ChevronsUpDown className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm...' className='h-9' />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                          <CommandGroup>
                            {communes.map((commune) => (
                              <CommandItem
                                key={commune._id}
                                value={commune.name}
                                onSelect={() => {
                                  form.setValue('communeId', commune._id)
                                }}
                              >
                                {commune.prefix} {commune.name}
                                <Check
                                  className={cn('ml-auto', commune._id === field.value ? 'opacity-100' : 'opacity-0')}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Địa chỉ chi tiết */}
        <div className='col-span-6'>
          <FormField
            control={form.control}
            name='detail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ chi tiết</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Không cần nhập tỉnh/thành phố, phường/xã, bạn chỉ cần nhập số nhà, tên đường, tên khu vực...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Loại địa chỉ */}
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Loại địa chỉ</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col'>
                  <FormItem className='flex items-center gap-3'>
                    <FormControl>
                      <RadioGroupItem value={AddressType.Home.toString()} />
                    </FormControl>
                    <FormLabel className='font-normal'>Nhà riêng</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center gap-3'>
                    <FormControl>
                      <RadioGroupItem value={AddressType.Office.toString()} />
                    </FormControl>
                    <FormLabel className='font-normal'>Cơ quan</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit */}
        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            {!isUpdateMode ? 'Thêm địa chỉ' : 'Lưu lại'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
