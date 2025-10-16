'use client'

import { io } from 'socket.io-client'

import { ENV_CONFIG } from '@/constants/config'

export const socket = io(ENV_CONFIG.NEXT_PUBLIC_SERVER_BASE_URL)
