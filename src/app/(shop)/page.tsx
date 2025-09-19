import Link from 'next/link'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export default function HomePage() {
  return (
    <div>
      <Button asChild>
        <Link href={PATH.LOGIN}>Đăng nhập</Link>
      </Button>
    </div>
  )
}
