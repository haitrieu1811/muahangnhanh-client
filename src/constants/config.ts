import z from 'zod'

import { UTILS_MESSAGE } from '@/constants/message'

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_SERVER_BASE_URL: z.string()
})

const envSafeParse = envSchema.safeParse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_SERVER_BASE_URL: process.env.NEXT_PUBLIC_SERVER_BASE_URL
})

if (!envSafeParse.success) {
  throw new Error(UTILS_MESSAGE.ENV_ERROR)
}

export const ENV_CONFIG = envSafeParse.data
