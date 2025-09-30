import Link from 'next/link'

import PATH from '@/constants/path'

export default function Logo() {
  return (
    <Link href={PATH.HOME} className='font-black text-3xl border-b-4 border-main dark:border-main-foreground'>
      MHNH
    </Link>
  )
}
