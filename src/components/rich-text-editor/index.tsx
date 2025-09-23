'use client'

import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import MenuBar from '@/components/rich-text-editor/menu-bar'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3'
          }
        },
        bold: {
          HTMLAttributes: {
            class: 'font-semibold'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'text-sm'
          }
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight,
      Image.configure({
        HTMLAttributes: {
          class: 'w-1/2 mx-auto'
        }
      })
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] border rounded-md py-2 px-3'
      }
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      console.log(editor.getHTML())
    }
  })

  return (
    <React.Fragment>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </React.Fragment>
  )
}
