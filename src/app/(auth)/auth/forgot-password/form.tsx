'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import usersApis from '@/apis/users.apis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import { cn, handleErrorsFromServer } from '@/lib/utils'
import { userRules } from '@/rules/users.rules'

const forgotPasswordRules = userRules.pick({
  email: true
})

type ForgotPasswordSchema = z.infer<typeof forgotPasswordRules>

export default function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordRules),
    defaultValues: {
      email: ''
    }
  })

  const forgotPasswordMutation = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: usersApis.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      form.reset()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    forgotPasswordMutation.mutate(data.email)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Quên mật khẩu</CardTitle>
          <CardDescription>Điền email bạn đã đăng ký tài khoản bên dưới</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={handleSubmit}>
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
                      <FormDescription>
                        Nếu không nhận được mail, vui lòng kiểm tra mục thư rác của bạn.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={forgotPasswordMutation.isPending} type='submit' className='w-full'>
                  {forgotPasswordMutation.isPending && <Loader2 className='animate-spin' />}
                  Gửi yêu cầu
                </Button>
              </div>
              <div className='text-right text-sm space-x-4'>
                <Link href={PATH.LOGIN} className='underline underline-offset-4'>
                  Đăng nhập
                </Link>
                <Link href={PATH.REGISTER} className='underline underline-offset-4'>
                  Đăng ký
                </Link>
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
