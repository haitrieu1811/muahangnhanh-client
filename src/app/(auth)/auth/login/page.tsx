import { Metadata } from 'next'

import LoginForm from '@/app/(auth)/auth/login/login-form'

export const metadata: Metadata = {
  title: 'Đăng nhập hệ thống'
}

export default function LoginPage() {
  return <LoginForm />
}
