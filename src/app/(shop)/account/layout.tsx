import React from 'react'

import AccountSidebar from '@/app/(shop)/account/sidebar'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container'>
      <div className='flex justify-between items-start space-x-4 py-4'>
        <AccountSidebar />
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  )
}
