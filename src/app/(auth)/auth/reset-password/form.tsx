'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PATH from '@/constants/path'
import useAppContext from '@/hooks/use-app-context'
import { cn, handleErrorsFromServer } from '@/lib/utils'
import { resetPasswordRules, ResetPasswordSchema } from '@/rules/users.rules'

export default function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const forgotPasswordToken = searchParams.get('token')

  const { setIsAuthenticated, setUser } = useAppContext()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordRules),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const resetPasswordMutation = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: usersApis.resetPasswordFromNextClientToNextServer,
    onSuccess: async (data) => {
      const { user } = data.payload.data
      setUser(user)
      setIsAuthenticated(true)
      form.reset()
      toast.success(data.payload.message)
      router.push(PATH.ACCOUNT)
      router.refresh()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!forgotPasswordToken) return
    resetPasswordMutation.mutate({
      ...data,
      forgotPasswordToken
    })
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Yêu cầu đặt lại mật khẩu chỉ có thời hạn 10 phút từ lúc nhận được mail, vui lòng gửi lại yêu cầu khác nếu
            quá 10 phút
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-6'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
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
                      <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={resetPasswordMutation.isPending} className='w-full'>
                  {resetPasswordMutation.isPending && <Loader2 className='animate-spin' />}
                  Đặt lại mật khẩu
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
