import http from '@/lib/http'
import {
  CreateAddressReqBody,
  CreateAddressResponse,
  GetAddressesResponse,
  GetCommunesResponse,
  GetProvincesResponse
} from '@/types/addresses.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const addressesApis = {
  getProvinces() {
    return http.get<GetProvincesResponse>('/provinces')
  },

  getCommunes(provinceId: string) {
    return http.get<GetCommunesResponse>(`/provinces/${provinceId}/communes`)
  },

  createAddress(body: CreateAddressReqBody) {
    return http.post<CreateAddressResponse>('/addresses', body)
  },

  getMyAddressesFromNextServerToServer(accessToken: string) {
    return http.get<GetAddressesResponse>('/addresses/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getMyAddressesFromNextClientToServer() {
    return http.get<GetAddressesResponse>('/addresses/me')
  },

  setDefaultAddress(addressId: string) {
    return http.post<OnlyMessageResponse>(`/addresses/${addressId}/set-default`, {})
  },

  updateAddress({ body, addressId }: { body: CreateAddressReqBody; addressId: string }) {
    return http.put<CreateAddressResponse>(`/addresses/${addressId}`, body)
  },

  deleteAddress(addressId: string) {
    return http.delete<OnlyMessageResponse>(`/addresses/${addressId}`, {})
  }
} as const

export default addressesApis
