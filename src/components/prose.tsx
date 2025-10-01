import { cn } from '@/lib/utils'

export default function Prose({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto space-y-4! max-w-6xl prose-p:text-sm prose-p:leading-relaxed prose-p:text-justify! prose-img:rounded-md prose-img:w-1/2 prose-img:object-contain',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
