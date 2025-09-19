/* eslint-disable @typescript-eslint/no-explicit-any */

import { LOGIN_API_ENDPOINT, LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT } from '@/apis/users.apis'
import { ENV_CONFIG } from '@/constants/config'
import {
  clearAuthLS,
  setAccessTokenExpiresAtToLS,
  setAccessTokenToLS,
  setRefreshTokenExpiresAtToLS,
  setRefreshTokenToLS
} from '@/lib/storage'
import { jwtDecode, normalizePath } from '@/lib/utils'
import { SuccessResponse, TokensResponse } from '@/types/utils.types'

export const isClient = () => typeof window !== 'undefined'

const ENTITY_ERROR_STATUS_CODE = 422

type EntityErrorPayload = {
  message: string
  errors: {
    [key: string]: string
  }
}

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

export class HttpError extends Error {
  status: number
  payload: any

  constructor({ status, payload, message = 'Http Error !' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS_CODE
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS_CODE; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Entity Error !' })
    this.status = status
    this.payload = payload
  }
}

const request = async <Response>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', options?: CustomOptions) => {
  /**
   * Nếu không truyền giá trị `options.baseUrl` thì sẽ gọi API đến server backend
   * nếu truyền giá trị `options.baseUrl` = '' thì sẽ gọi API đến Next JS server
   */
  const baseUrl = options?.baseUrl === undefined ? ENV_CONFIG.NEXT_PUBLIC_SERVER_BASE_URL : options.baseUrl
  const fullUrl = `${baseUrl}/${normalizePath(path)}`

  const body = options?.body ? JSON.stringify(options.body) : undefined

  const baseHeaders: {
    [key: string]: string
  } = {
    'Content-Type': 'application/json'
  }

  const res = await fetch(fullUrl, {
    method,
    body,
    headers: {
      ...baseHeaders,
      ...options?.headers
    }
  })

  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }

  // Xử lý lỗi ở đây
  if (!res.ok) {
    // Lỗi 422 (lỗi form)
    if (res.status === ENTITY_ERROR_STATUS_CODE) {
      throw new EntityError({
        status: ENTITY_ERROR_STATUS_CODE,
        payload: payload as EntityErrorPayload
      })
    } else {
      throw new HttpError({
        status: res.status,
        payload
      })
    }
  }

  // Xử lý khi request thành công (ở client)
  if (isClient()) {
    if ([LOGIN_API_ENDPOINT].map((item) => normalizePath(item)).includes(normalizePath(path))) {
      const { accessToken, refreshToken } = (payload as SuccessResponse<TokensResponse>).data
      const decodedAccessToken = jwtDecode(accessToken)
      const decodedRefreshToken = jwtDecode(refreshToken)
      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)
      setAccessTokenExpiresAtToLS(new Date(decodedAccessToken.exp * 1000).toISOString())
      setRefreshTokenExpiresAtToLS(new Date(decodedRefreshToken.exp * 1000).toISOString())
    } else if (normalizePath(LOGOUT_FROM_NEXT_CLIENT_TO_NEXT_SERVER_API_ENDPOINT) === normalizePath(path)) {
      clearAuthLS()
    }
  }
  return data
}

const http = {
  get<Response>(path: string, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'GET', options)
  },

  post<Response>(path: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'POST', {
      ...options,
      body
    })
  },

  put<Response>(path: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'PUT', {
      ...options,
      body
    })
  },

  delete<Response>(path: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'DELETE', {
      ...options,
      body
    })
  }
}

export default http
