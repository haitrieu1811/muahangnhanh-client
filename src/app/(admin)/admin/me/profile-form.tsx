'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import SelectImages from '@/components/select-images'
import UploadImages from '@/components/upload-images'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppContext from '@/hooks/use-app-context'
import { updateMeRules, UpdateMeSchema } from '@/rules/users.rules'
import { User } from '@/types/users.types'

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter()

  const [avatar, setAvatar] = React.useState<{
    url: string
    _id: string
  } | null>(null)

  React.useEffect(() => {
    if (user.avatar && user.avatarId) {
      setAvatar({
        _id: user.avatarId,
        url: user.avatar
      })
    }
  }, [user])

  const { setUser } = useAppContext()

  const form = useForm<UpdateMeSchema>({
    resolver: zodResolver(updateMeRules),
    defaultValues: {
      fullName: user.fullName
    }
  })

  const updateMeMutation = useMutation({
    mutationKey: ['update-me'],
    mutationFn: usersApis.updateMe,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      setUser(data.payload.data.user)
      router.refresh()
    }
  })

  const handleCancel = () => {
    form.reset()
  }

  const handleSubmit = form.handleSubmit((data) => {
    const body = {
      fullName: data.fullName,
      avatar: avatar?._id ? avatar._id : undefined
    }
    updateMeMutation.mutate(body)
  })

  return (
    <Form {...form}>
      <form className='grid gap-8' onSubmit={handleSubmit}>
        <div className='grid gap-2'>
          <Label>Ảnh đại diện</Label>
          <Avatar className='size-20'>
            <AvatarImage src={avatar?.url} alt={user.fullName} className='object-cover' />
            <AvatarFallback>
              {user.fullName[0].toUpperCase()}
              {user.fullName[1].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex space-x-2'>
            <UploadImages />
            <SelectImages
              onSubmit={(images) => {
                const { _id, url } = images[0]
                setAvatar({ _id, url })
              }}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-8'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6 grid gap-2'>
            <Label>Email</Label>
            <Input defaultValue={user.email} disabled />
            <FormDescription>Email không thể thay đổi sau khi tạo tài khoản.</FormDescription>
          </div>
        </div>
        <div className='flex justify-end space-x-2'>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button type='submit' disabled={updateMeMutation.isPending}>
            {updateMeMutation.isPending && <Loader2 className='animate-spin' />}
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  )
}
