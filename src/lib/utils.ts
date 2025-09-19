/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { EntityError } from '@/lib/http'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorsFromServer = (error: Error, setError?: UseFormSetError<any>) => {
  if (error instanceof EntityError && setError) {
    const errors = error.payload.errors
    Object.keys(errors).forEach((key) => {
      setError(key, {
        message: errors[key],
        type: 'server'
      })
    })
  } else {
    toast.error(error.message)
  }
}
