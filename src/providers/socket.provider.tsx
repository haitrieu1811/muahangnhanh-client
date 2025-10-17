'use client'

import React from 'react'
import type { Socket } from 'socket.io-client'

import { socket } from '@/lib/socket'
import { getAccessTokenFromLS } from '@/lib/storage'
import useAppContext from '@/hooks/use-app-context'

type SocketContext = Socket

const initialContext: SocketContext = socket

const SocketContext = React.createContext<SocketContext>(initialContext)

export const useSocket = () => React.useContext(SocketContext)

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext()

  React.useEffect(() => {
    socket.auth = {
      Authorization: `Bearer ${getAccessTokenFromLS()}`
    }

    if (socket.connected) {
      onConnect()
    } else {
      socket.connect()
    }

    function onConnect() {
      console.log(`${socket.id} đã kết nối`)
    }

    function onDisconnect() {
      console.log('Đã ngắt kết nối')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onConnectError(error: any) {
      console.log(`Không thể kết nối với Socket server: `, error?.data)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error')
    }
  }, [isAuthenticated])

  return <SocketContext value={socket}>{children}</SocketContext>
}
