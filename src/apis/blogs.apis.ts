import http from '@/lib/http'
import { GetBlogsResponse } from '@/types/blogs.types'

const blogsApis = {
  getBlogs() {
    return http.get<GetBlogsResponse>('/blogs')
  }
} as const

export default blogsApis
