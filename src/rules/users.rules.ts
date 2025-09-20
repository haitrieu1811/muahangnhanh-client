import z from 'zod'

import { USERS_MESSAGES } from '@/constants/message'
import { EMAIL_REGEX } from '@/constants/regex'

export const userRules = z.object({
  email: z.string().regex(EMAIL_REGEX, USERS_MESSAGES.EMAIL_IS_INVALID),
  password: z.string().min(8, USERS_MESSAGES.PASSWORD_LENGTH_INVALID).max(32, USERS_MESSAGES.PASSWORD_LENGTH_INVALID),
  confirmPassword: z.string().min(1, USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
})

export const loginRules = userRules
  .pick({
    email: true,
    password: true
  })
  .strict()

export const registerRules = userRules
  .pick({
    email: true,
    password: true,
    confirmPassword: true
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        message: USERS_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCH,
        code: 'custom',
        path: ['confirmPassword']
      })
    }
  })

export type LoginSchema = z.infer<typeof loginRules>
export type RegisterSchema = z.infer<typeof registerRules>
