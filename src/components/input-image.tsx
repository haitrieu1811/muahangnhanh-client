/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { CloudUpload } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function InputImage({
  multiple = false,
  onChange
}: {
  multiple?: boolean
  onChange: (files: File[]) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleStart = () => {
    inputRef.current?.click()
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      onChange && onChange([...files])
    }
  }

  return (
    <React.Fragment>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        multiple={multiple}
        hidden
        onChange={handleChangeFile}
        onClick={(e) => ((e.target as any).value = null)}
      />
      <Button type='button' variant='outline' size='sm' onClick={handleStart}>
        <CloudUpload />
        Tải ảnh lên
      </Button>
    </React.Fragment>
  )
}
