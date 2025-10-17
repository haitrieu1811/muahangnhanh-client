'use client'

import React from 'react'

import { getAccessTokenFromLS, getUserFromLS } from '@/lib/storage'
import { User } from '@/types/users.types'

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isHasAccessTokenInCookie: boolean
  setIsHasAccessTokenInCookie: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: () => null,
  user: getUserFromLS(),
  setUser: () => null,
  isHasAccessTokenInCookie: false,
  setIsHasAccessTokenInCookie: () => null
}

export const AppContext = React.createContext<AppContext>(initialAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [user, setUser] = React.useState<User | null>(initialAppContext.user)
  const [isHasAccessTokenInCookie, setIsHasAccessTokenInCookie] = React.useState<boolean>(
    initialAppContext.isHasAccessTokenInCookie
  )

  return (
    <AppContext
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isHasAccessTokenInCookie,
        setIsHasAccessTokenInCookie
      }}
    >
      {children}
    </AppContext>
  )
}
