import Link from 'next/link'

import PATH from '@/constants/path'

export default function Logo() {
  return (
    <Link
      href={PATH.HOME}
      className='font-black text-lg md:text:xl lg:text-3xl border-b-2 lg:border-b-4 border-main dark:border-main-foreground'
    >
      MHNH
    </Link>
  )
}
