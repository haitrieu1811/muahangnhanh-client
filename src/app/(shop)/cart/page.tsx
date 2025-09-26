import CartList from '@/app/(shop)/cart/list'
import CartStep from '@/app/(shop)/cart/step'
import { Card, CardContent } from '@/components/ui/card'

export default function CartPage() {
  return (
    <div className='container py-4'>
      <Card className='w-[600px] mx-auto'>
        <CardContent className='space-y-10'>
          <CartStep />
          <CartList />
        </CardContent>
      </Card>
    </div>
  )
}
