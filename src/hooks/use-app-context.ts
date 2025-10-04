import React from 'react'

import { AppContext } from '@/providers/app.provider'

export default function useAppContext() {
  return React.use(AppContext)
}
