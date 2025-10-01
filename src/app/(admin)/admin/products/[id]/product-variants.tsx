import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader } from '@/components/ui/card'

export default function ProductVariants() {
  return (
    <Card>
      <CardHeader>
        <CardAction>
          <Button variant='outline'>
            <PlusCircle />
            Thêm biến thể khác
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
