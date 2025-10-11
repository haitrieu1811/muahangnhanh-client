import { Metadata } from 'next'
import { Suspense } from 'react'

import ResetPasswordForm from '@/app/(auth)/auth/reset-password/form'

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu.'
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
