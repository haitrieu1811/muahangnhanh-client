/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from 'clsx'
import { formatDistance } from 'date-fns'
import jwt from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { EntityError } from '@/lib/http'
import { TokenPayload } from '@/types/utils.types'

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

export const jwtDecode = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export const dateDistance = (date: string) => {
  return formatDistance(date, new Date(), { addSuffix: true })
    .replace('a few seconds ago', 'vài giây trước')
    .replace('seconds ago', 'giây trước')
    .replace('1 minute ago', '1 phút trước')
    .replace('minutes ago', 'phút trước')
    .replace('an hour ago', '1 giờ trước')
    .replace('hours ago', 'giờ trước')
    .replace('a day ago', '1 ngày trước')
    .replace('days ago', 'ngày trước')
    .replace('a month ago', '1 tháng trước')
    .replace('months ago', 'tháng trước')
    .replace('a year ago', '1 năm trước')
    .replace('years ago', 'năm trước')
    .replace('about', '')
    .replace('less than', 'hơn')
}
