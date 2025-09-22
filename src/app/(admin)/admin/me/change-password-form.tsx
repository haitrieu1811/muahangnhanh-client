'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { handleErrorsFromServer } from '@/lib/utils'
import { changePasswordRules, ChangePasswordSchema } from '@/rules/users.rules'

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordRules),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const changePasswordMutation = useMutation({
    mutationKey: ['change-password'],
    mutationFn: usersApis.changePassword,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      form.reset()
    },
    onError: (error) => {
      handleErrorsFromServer(error, form.setError)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate(data)
  })

  return (
    <Form {...form}>
      <form className='grid gap-8' onSubmit={handleSubmit}>
        <div className='grid grid-cols-12 gap-8'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu cũ</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
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
          </div>
          <div className='col-span-6'>
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
          </div>
        </div>
        <div className='flex justify-end'>
          <Button type='submit' disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending && <Loader2 className='animate-spin' />}
            Thay đổi mật khẩu
          </Button>
        </div>
      </form>
    </Form>
  )
}
