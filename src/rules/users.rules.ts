import z from 'zod'

import { USERS_MESSAGES } from '@/constants/message'
import { EMAIL_REGEX } from '@/constants/regex'

export const userRules = z.object({
  email: z.string().regex(EMAIL_REGEX, USERS_MESSAGES.EMAIL_IS_INVALID),
  password: z.string().min(8, USERS_MESSAGES.PASSWORD_LENGTH_INVALID).max(32, USERS_MESSAGES.PASSWORD_LENGTH_INVALID)
})

export const loginRules = userRules.pick({
  email: true,
  password: true
})

export type LoginSchema = z.infer<typeof loginRules>
