'use client'

import { useMutation } from '@tanstack/react-query'
import { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  Strikethrough
} from 'lucide-react'
import React from 'react'

import mediasApis from '@/apis/medias.apis'
import { Toggle } from '@/components/ui/toggle'
import { ENV_CONFIG } from '@/constants/config'
import useIsClient from '@/hooks/use-is-client'

export default function MenuBar({ editor }: { editor: Editor | null }) {
  const isClient = useIsClient()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const uploadImagesMutation = useMutation({
    mutationKey: ['upload-images'],
    mutationFn: mediasApis.uploadImages,
    onSuccess: (data) => {
      const src = `${ENV_CONFIG.NEXT_PUBLIC_SERVER_BASE_URL}/static/images/${data.payload.data.medias[0].name}`
      editor?.chain().focus().setImage({ src }).run()
    }
  })

  if (!editor || !isClient) {
    return null
  }

  const Options = [
    {
      icon: <Heading1 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive('heading', { level: 1 })
    },
    {
      icon: <Heading2 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive('heading', { level: 2 })
    },
    {
      icon: <Heading3 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive('heading', { level: 3 })
    },
    {
      icon: <Bold className='size-4' />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive('bold')
    },
    {
      icon: <Italic className='size-4' />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive('italic')
    },
    {
      icon: <Strikethrough className='size-4' />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive('strike')
    },
    {
      icon: <AlignLeft className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      preesed: editor.isActive({ textAlign: 'left' })
    },
    {
      icon: <AlignCenter className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      preesed: editor.isActive({ textAlign: 'center' })
    },
    {
      icon: <AlignRight className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      preesed: editor.isActive({ textAlign: 'right' })
    },
    {
      icon: <List className='size-4' />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive('bulletList')
    },
    {
      icon: <ListOrdered className='size-4' />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive('orderedList')
    },
    {
      icon: <Highlighter className='size-4' />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive('highlight')
    },
    {
      // eslint-disable-next-line jsx-a11y/alt-text
      icon: <Image className='size-4' />,
      onClick: () => inputRef.current?.click(),
      preesed: editor.isActive('image')
    }
  ]

  return (
    <div className='border rounded-md p-1 mb-1 space-x-2'>
      <input
        hidden
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={(e) => {
          const files = e.target.files
          if (files) {
            const form = new FormData()
            form.append('image', files[0])
            uploadImagesMutation.mutate(form)
          }
        }}
      />
      {Options.map((option, index) => (
        <Toggle key={index} pressed={option.preesed} onPressedChange={option.onClick}>
          {option.icon}
        </Toggle>
      ))}
    </div>
  )
}
