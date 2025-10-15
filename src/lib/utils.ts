/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from 'clsx'
import { formatDistance } from 'date-fns'
import jwt from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import usersApis from '@/apis/users.apis'
import { EntityError } from '@/lib/http'
import { clearAuthLS, getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/storage'
import { Address } from '@/types/addresses.types'
import { TokenPayload } from '@/types/utils.types'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Loại bỏ ký tự `/` đầu tiên nếu đường dẫn bắt đầu bằng ký tự `/`
 */
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

export const formatCurrency = (currency: number) => {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export const rateSale = (originalPrice: number, salePrice: number) => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

const removeSpecialCharacter = (text: string): string => {
  text = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  text = text.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  return text
}

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export const formatAddress = (address: Address) => {
  return `${address.detail}, ${address.commune.prefix} ${address.commune.name}, ${address.province.prefix} ${address.province.name}`
}

export const handleCheckAndRefreshToken = async (params?: { onError?: () => void; onSuccess?: () => void }) => {
  const myAccessToken = getAccessTokenFromLS()
  const myRefreshToken = getRefreshTokenFromLS()

  // Chưa đăng nhập thì không cần refresh token
  if (!myAccessToken || !myRefreshToken) return

  const decodedAccessToken = jwtDecode(myAccessToken)
  const decodedRefreshToken = jwtDecode(myRefreshToken)

  /**
   * Lấy ra thời điểm hiện tại theo định dạng epochtime (ms),
   * do access token expires tính theo epochtime giây (s) nên phải chuyển đổi sang giây
   * bằng cách chia cho 1000
   */
  const now = new Date().getTime() / 1000 - 1

  // Nếu refresh token hết hạn (hết phiên đăng nhập thì dừng lại và cho đăng xuất)
  if (decodedRefreshToken.exp <= now) {
    clearAuthLS()
    params?.onError?.()
    return
  }

  /**
   * Thời gian còn lại của AT (access token) = decodedAccessToken.exp - now
   * Thời hạn sử dụng của AT = decodedAccessToken.exp - decodedAccessToken.iat
   * Nếu thời gian còn lại của AT nhỏ hơn 1/3 thời gian sử dụng của AT (với điều kiện refresh
   * token phải còn hạn) thì cho tiến hành refresh token
   * Ví dụ: nếu một AT có hạn sử dụng 30s khi hạn sử dụng 10s thì cho refresh token
   */
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      await usersApis.refreshTokenFromNextClientToNextServer()
      params?.onSuccess?.()
    } catch {
      params?.onError?.()
    }
  }
}
