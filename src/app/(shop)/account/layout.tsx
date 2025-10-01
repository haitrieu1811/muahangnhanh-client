import React from 'react'

import AccountSidebar from '@/app/(shop)/account/sidebar'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container'>
      <div className='flex flex-wrap justify-between items-start lg:space-x-4 space-y-4 lg:space-y-0 py-4'>
        <AccountSidebar />
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  )
}
