import { AddressType } from '@/constants/enum'
import { SuccessResponse } from '@/types/utils.types'

export type ProvinceType = {
  _id: string
  name: string
  prefix: string
  createdAt: string
  updatedAt: string
}

export type GetProvincesResponse = SuccessResponse<{
  totalProvinces: number
  provinces: ProvinceType[]
}>

export type CommuneType = {
  _id: string
  provinceId: string
  name: string
  prefix: string
  createdAt: string
  updatedAt: string
}

export type GetCommunesResponse = SuccessResponse<{
  totalCommunes: number
  communes: CommuneType[]
}>

export type CreateAddressReqBody = {
  fullName: string
  phoneNumber: string
  provinceId: string
  communeId: string
  detail: string
  type: AddressType
}

export type OriginalAddress = {
  _id: string
  userId: string
  fullName: string
  phoneNumber: string
  provinceId: string
  communeId: string
  detail: string
  type: AddressType
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type CreateAddressResponse = SuccessResponse<{
  address: OriginalAddress
}>

export type Address = {
  _id: string
  fullName: string
  phoneNumber: string
  province: {
    _id: string
    name: string
    prefix: string
    createdAt: string
    updatedAt: string
  }
  commune: {
    _id: string
    name: string
    prefix: string
    createdAt: string
    updatedAt: string
  }
  detail: string
  type: AddressType
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type GetAddressesResponse = SuccessResponse<{
  addresses: Address[]
  totalAddresses: number
}>
