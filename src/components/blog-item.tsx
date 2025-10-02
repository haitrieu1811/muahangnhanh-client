import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { BlogType } from '@/types/blogs.types'

export default function BlogItem({ blog }: { blog: BlogType }) {
  return (
    <Link
      href={PATH.BLOGS_DETAIL({
        name: blog.title,
        id: blog._id
      })}
      className='group relative block rounded-md overflow-hidden space-y-2'
    >
      <div className='rounded-md overflow-hidden'>
        <Image
          width={200}
          height={200}
          src={blog.thumbnail.url}
          alt={blog.title}
          className='w-full aspect-video object-cover group-hover:scale-105 duration-100'
        />
      </div>
      <h3 className='text-sm line-clamp-2 font-medium'>{blog.title}</h3>
    </Link>
  )
}
