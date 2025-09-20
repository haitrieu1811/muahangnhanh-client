import { AvatarFallback, AvatarImage, Avatar as ShadcnAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function Avatar({
  imageUrl,
  fullName,
  className
}: {
  imageUrl: string
  fullName: string
  className?: string
}) {
  return (
    <ShadcnAvatar className={cn('h-8 w-8 rounded-lg', className)}>
      <AvatarImage src={imageUrl} alt={fullName} />
      <AvatarFallback className='rounded-lg'>
        {fullName[0].toUpperCase()}
        {fullName[1].toUpperCase()}
      </AvatarFallback>
    </ShadcnAvatar>
  )
}
