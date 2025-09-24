import LogoutButton from '@/components/logout-button'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div>
      <Button className='bg-main-and-hover'>CLick me</Button>
      <LogoutButton />
    </div>
  )
}
