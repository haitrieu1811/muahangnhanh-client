import { isClient } from '@/lib/http'

export const setAccessTokenToLS = (token: string) => {
  if (isClient()) {
    localStorage.setItem('accessToken', token)
  }
}

export const setRefreshTokenToLS = (token: string) => {
  if (isClient()) {
    localStorage.setItem('refreshToken', token)
  }
}

export const setAccessTokenExpiresAtToLS = (expiresAt: string) => {
  if (isClient()) {
    localStorage.setItem('accessTokenExpiresAt', expiresAt)
  }
}

export const setRefreshTokenExpiresAtToLS = (expiresAt: string) => {
  if (isClient()) {
    localStorage.setItem('refreshTokenExpiresAt', expiresAt)
  }
}

export const getAccessTokenFromLS = () => {
  if (isClient()) {
    return localStorage.getItem('accessToken')
  }
}

export const getRefreshTokenFromLS = () => {
  if (isClient()) {
    return localStorage.getItem('refreshToken')
  }
}

export const getAccessTokenExpiresAtFromLS = () => {
  if (isClient()) {
    return localStorage.getItem('accessTokenExpiresAt')
  }
}

export const getRefreshTokenExpiresAtFromLS = () => {
  if (isClient()) {
    return localStorage.getItem('refreshTokenExpiresAt')
  }
}

export const clearAuthLS = () => {
  if (isClient()) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessTokenExpiresAt')
    localStorage.removeItem('refreshTokenExpiresAt')
  }
}
