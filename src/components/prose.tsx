import { cn } from '@/lib/utils'

export default function Prose({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        'prose mx-auto max-w-6xl text-sm leading-7 text-black prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-black prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 prose-strong:text-black prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6 dark:text-white dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white text-justify',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
