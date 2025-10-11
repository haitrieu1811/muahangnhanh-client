import { Metadata } from 'next'

import ForgotPasswordForm from '@/app/(auth)/auth/forgot-password/form'

export const metadata: Metadata = {
  title: 'Quên mật khẩu'
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
