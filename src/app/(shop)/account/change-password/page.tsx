import ChangePasswordForm from '@/app/(admin)/admin/me/change-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountChangePasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Đổi mật khẩu</CardTitle>
        <CardDescription>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  )
}
