import { Metadata } from 'next'

import RegisterForm from '@/app/(auth)/auth/register/register-form'

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản'
}

export default function RegisterPage() {
  return <RegisterForm />
}
