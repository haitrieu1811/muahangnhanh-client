import { isClient } from '@/lib/http'
import { User } from '@/types/users.types'

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

export const setUserToLS = (user: User) => {
  if (isClient()) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const getUserFromLS = () => {
  if (isClient()) {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

export const clearAuthLS = () => {
  if (isClient()) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
}
