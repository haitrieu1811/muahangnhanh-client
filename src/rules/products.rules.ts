import z from 'zod'

import { ProductStatus } from '@/constants/enum'
import { PRODUCTS_MESSAGES } from '@/constants/message'
import { NUMBER_GREATER_THAN_ONE_REGEX } from '@/constants/regex'

export const productRules = z.object({
  name: z
    .string()
    .min(10, PRODUCTS_MESSAGES.PRODUCT_NAME_LENGTH_IS_INVALID)
    .max(120, PRODUCTS_MESSAGES.PRODUCT_NAME_LENGTH_IS_INVALID),
  description: z.string().min(100, PRODUCTS_MESSAGES.PRODUCT_DESCRIPTION_LENGTH_IS_INVALID),
  price: z
    .string()
    .regex(NUMBER_GREATER_THAN_ONE_REGEX, PRODUCTS_MESSAGES.PRODUCT_PRICE_MUST_BE_A_INT_GREATER_THAN_ZERO),
  priceAfterDiscount: z.string().optional(),
  status: z.enum([ProductStatus.Active.toString(), ProductStatus.Inactive.toString()]).optional()
})

export const createProductRules = productRules
  .pick({
    name: true,
    description: true,
    price: true,
    priceAfterDiscount: true,
    status: true
  })
  .strict()
  .superRefine(({ priceAfterDiscount }, ctx) => {
    if (priceAfterDiscount && !NUMBER_GREATER_THAN_ONE_REGEX.test(priceAfterDiscount)) {
      ctx.addIssue({
        message: PRODUCTS_MESSAGES.PRODUCT_PRICE_MUST_BE_A_INT_GREATER_THAN_ZERO,
        code: 'custom',
        path: ['priceAfterDiscount']
      })
    }
  })

export type CreateProductSchema = z.infer<typeof createProductRules>
