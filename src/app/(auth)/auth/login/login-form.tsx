'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import { clearAuthLS } from '@/lib/storage'
import { cn, handleErrorsFromServer } from '@/lib/utils'
import { loginRules, LoginSchema } from '@/rules/users.rules'
import { useSocket } from '@/providers/socket.provider'

export default function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const clearTokens = searchParams.get('clearTokens')

  const socket = useSocket()

  /**
   * Xử lý trường hợp lâu ngày không vào web mà refresh
   * token bị hết hạn
   */
  React.useEffect(() => {
    if (!clearTokens) return
    clearAuthLS()
  }, [clearTokens])

  const { setIsAuthenticated, setUser } = useAppContext()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginRules),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: usersApis.loginFromNextClientToNextServer,
    onSuccess: async (data) => {
      const { user } = data.payload.data
      router.push(PATH.HOME)
      setIsAuthenticated(true)
      setUser(user)
      socket.connect()
      router.refresh()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Chào mừng trở lại</CardTitle>
          <CardDescription>Điền thông tin để đăng nhập vào hệ thống</CardDescription>
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
                        <div className='flex items-center'>
                          <FormLabel>Mật khẩu</FormLabel>
                          <Link
                            href={PATH.FORGOT_PASSWORD}
                            tabIndex={-1}
                            className='ml-auto text-sm underline-offset-4 hover:underline'
                          >
                            Quên mật khẩu?
                          </Link>
                        </div>
                        <FormControl>
                          <InputPassword {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' disabled={loginMutation.isPending} className='w-full'>
                    {loginMutation.isPending && <Loader2 className='animate-spin' />}
                    Đăng nhập
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Bạn chưa có tài khoản?{' '}
                  <Link href={PATH.REGISTER} className='underline underline-offset-4'>
                    Đăng ký
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
