import Cart from '@/app/(shop)/cart'
import { Card, CardContent } from '@/components/ui/card'

export default function CartPage() {
  return (
    <div className='container py-4'>
      <Card className='max-w-screen w-[600px] mx-auto'>
        <CardContent>
          <Cart />
        </CardContent>
      </Card>
    </div>
  )
}
