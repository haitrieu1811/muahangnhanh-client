import z from 'zod'

import { BLOGS_MESSAGE } from '@/constants/message'

export const blogRules = z.object({
  title: z.string().min(1, BLOGS_MESSAGE.BLOG_TITLE_IS_REQUIRED),
  content: z.string().min(1, BLOGS_MESSAGE.BLOG_CONTENT_IS_REQUIRED)
})

export const createBlogRules = blogRules.pick({
  title: true,
  content: true
})

export type CreateBlogSchema = z.infer<typeof createBlogRules>
