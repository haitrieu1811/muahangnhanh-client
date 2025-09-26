import z from 'zod'

import { AddressType } from '@/constants/enum'
import { ADDRESS_MESSAGES } from '@/constants/message'
import { PHONE_NUMBER_REGEX } from '@/constants/regex'

export const addressRules = z.object({
  fullName: z.string().min(1, ADDRESS_MESSAGES.ADDRESS_FULLNAME_IS_REQUIRED),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, ADDRESS_MESSAGES.ADDRESS_PHONE_NUMBER_IS_INVALID),
  detail: z.string().min(1, ADDRESS_MESSAGES.ADDRESS_DETAIL_IS_REQUIRED),
  type: z.enum([AddressType.Home.toString(), AddressType.Office.toString()]),
  provinceId: z.string().min(1, ADDRESS_MESSAGES.PROVINCE_IS_REQUIRED),
  communeId: z.string().min(1, ADDRESS_MESSAGES.COMMUNES_IS_REQUIRED)
})

export const createAddressRules = addressRules.pick({
  fullName: true,
  phoneNumber: true,
  detail: true,
  type: true,
  provinceId: true,
  communeId: true
})

export type CreateAddressSchema = z.infer<typeof createAddressRules>
