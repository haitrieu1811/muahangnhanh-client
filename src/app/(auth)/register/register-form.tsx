'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UserRole } from '@/constants/enum'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import { cn, handleErrorsFromServer } from '@/lib/utils'
import { registerRules, RegisterSchema } from '@/rules/users.rules'

export default function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()

  const { setIsAuthenticated, setUser } = useAppContext()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerRules),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: usersApis.register,
    onSuccess: async (data) => {
      // Đăng nhập ngay sau khi đăng ký thành công
      const { accessToken, refreshToken, user } = data.payload.data
      await usersApis.setTokens({ accessToken, refreshToken })
      router.push(PATH.HOME)
      setIsAuthenticated(true)
      setUser(user)
      router.refresh()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    // Trang này chỉ dành cho khách hàng nên khi đăng ký thì tài khoản sẽ auto role Customer
    registerMutation.mutate({
      ...data,
      role: UserRole.Customer
    })
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Đăng ký tài khoản</CardTitle>
          <CardDescription>Điền thông tin để đăng ký tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-6'>
                <div className='grid gap-6'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='m@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <InputPassword {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhập lại mật khẩu</FormLabel>
                        <FormControl>
                          <InputPassword {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' disabled={registerMutation.isPending} className='w-full'>
                    {registerMutation.isPending && <Loader2 className='animate-spin' />}
                    Đăng ký
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Bạn đã có tài khoản?{' '}
                  <Link href={PATH.LOGIN} className='underline underline-offset-4'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với chúng tôi <Link href='#'>điều khoản dịch vụ</Link> và{' '}
        <Link href='#'>chính sách bảo mật</Link>.
      </div>
    </div>
  )
}
